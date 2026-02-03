"use server"

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 12;

// 1. Obtener Productos (Público)
// Limpiamos la lógica de favoritos porque ahora se maneja en el cliente (LocalStorage)
export async function getProducts({
  query,
  category,
  page = 1,
}: {
  query?: string;
  category?: string;
  page?: number;
}) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.category = category; 
  }

  try {
    const products = await prisma.product.findMany({
      where,
      take: ITEMS_PER_PAGE,
      skip: skip,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        seller: true,
        // Eliminamos la relación 'favorites' porque el backend ya no necesita saberlo
      },
    });

    return products;

  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

// 2. Obtener mis productos en venta
export async function getMyProducts() {
  const { userId } = await auth();
  if (!userId) return [];

  // OJO: Asumimos que tu lógica guarda el sellerId igual al userId de Clerk
  // Si no te salen productos, avísame y cambiamos esto para buscar por email
  return await prisma.product.findMany({
    where: { sellerId: userId }, 
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      // favorites: true, // Opcional: Si quieres mostrar contador de likes en tu panel
    },
  });
}

// 3. Borrar un producto (Solo si es mío)
export async function deleteProduct(productId: string) {
  const user = await currentUser(); 
  if (!user) return { error: "No autorizado" };

  const email = user.emailAddresses[0].emailAddress;

  // A. Buscamos quién es el VENDEDOR asociado a este email
  const seller = await prisma.seller.findUnique({
    where: { email },
  });

  if (!seller) return { error: "No se encontró perfil de vendedor" };

  // B. Buscamos el producto
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  // C. Verificamos: ¿El dueño del producto es este Vendedor?
  if (!product || product.sellerId !== seller.id) {
    return { error: "No puedes borrar esto, no es tuyo" };
  }

  // D. Borramos
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/mis-publicaciones");
}

// 4. Crear Producto
export async function createProduct(data: {
  title: string;
  price: number;
  currency: string;
  category: string;
  description: string;
  images: string[]; // ← CAMBIO: array en vez de string
}) {
  const user = await currentUser();
  
  if (!user || !user.emailAddresses[0]) {
    throw new Error("Debes iniciar sesión para vender");
  }

  const email = user.emailAddresses[0].emailAddress;
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Vendedor Timbiriche";

  // A. AUTO-GENERACIÓN DE PERFIL DE VENDEDOR
  const seller = await prisma.seller.upsert({
    where: { email: email },
    update: {}, 
    create: {
      email: email,
      storeName: userName,
      avatar: user.imageUrl,
      phoneNumber: "", 
      isVerified: false,
      id: user.id
    },
  });

  // B. CREACIÓN DEL PRODUCTO CON MÚLTIPLES IMÁGENES
  await prisma.product.create({
    data: {
      title: data.title,
      price: Math.round(data.price),
      description: `[${data.currency}] ${data.description}`, 
      category: data.category,
      sellerId: seller.id,
      images: {
        create: data.images.map((url) => ({ url })), // ← CAMBIO: map para crear múltiples
      },
    },
  });

  // C. ACTUALIZAR CACHÉ
  revalidatePath("/");
}

// 5. ACTUALIZAR PRODUCTO
export async function updateProduct(productId: string, data: {
  title: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
}) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;

  // 1. Verificamos que el producto sea del usuario
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  if (!product || product.seller?.email !== email) {
    throw new Error("No tienes permiso para editar este producto");
  }

  // 2. Actualizamos el producto
  await prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      price: Math.round(data.price), // Convertir a centavos si tu DB lo requiere
      description: data.description,
      category: data.category,
      isActive: data.isActive, // Asegúrate de tener este campo en tu schema.prisma, si no, bórralo
    },
  });

  // 3. Actualizamos la imagen (Si cambió)
  // Nota: Esto asume que actualizamos la primera imagen encontrada.
  // Si tu lógica de imágenes es más compleja, avísame.
  const firstImage = await prisma.productImage.findFirst({
    where: { productId: productId }
  });

  if (firstImage) {
    await prisma.productImage.update({
      where: { id: firstImage.id },
      data: { url: data.imageUrl }
    });
  } else if (data.imageUrl) {
    // Si no tenía imagen y ahora sí, la creamos
    await prisma.productImage.create({
      data: {
        url: data.imageUrl,
        productId: productId
      }
    });
  }

  // 4. Refrescamos caché
  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/mis-publicaciones");
}

// 6. ACTUALIZAR PERFIL DE VENDEDOR
export async function updateProfile(data: { storeName: string; phoneNumber: string; avatar?: string }) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;

  // Actualizamos o creamos el vendedor
  await prisma.seller.upsert({
    where: { email },
    update: {
      storeName: data.storeName,
      phoneNumber: data.phoneNumber,
      // Solo actualizamos avatar si viene uno nuevo
      ...(data.avatar && { avatar: data.avatar }),
    },
    create: {
      email,
      storeName: data.storeName,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar || user.imageUrl,
      isVerified: false,
      id: user.id, 
    },
  });

  // Revalidamos rutas clave
  revalidatePath("/perfil");
  revalidatePath("/vender");
  revalidatePath("/mis-publicaciones");
  // Si tienes una página de perfil pública, revalídala también si es necesario
}