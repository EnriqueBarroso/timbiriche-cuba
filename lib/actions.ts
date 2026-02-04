"use server"

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 12;

/**
 * 1. OBTENER PRODUCTOS (PÚBLICO)
 */
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
      },
    });
    return products;
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

/**
 * 2. OBTENER MIS PRODUCTOS (PANEL VENDEDOR)
 */
export async function getMyProducts() {
  const user = await currentUser();
  if (!user) return [];

  const email = user.emailAddresses[0].emailAddress;

  return await prisma.product.findMany({
    where: { 
      seller: { email: email } 
    },
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });
}

/**
 * 3. BORRAR UN PRODUCTO
 */
export async function deleteProduct(productId: string) {
  const user = await currentUser();
  if (!user) return { error: "No autorizado" };

  const email = user.emailAddresses[0].emailAddress;

  const seller = await prisma.seller.findUnique({
    where: { email },
  });

  if (!seller) return { error: "No se encontró perfil de vendedor" };

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.sellerId !== seller.id) {
    return { error: "No tienes permiso para borrar este producto" };
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/mis-publicaciones");
  return { success: true };
}

/**
 * 4. CREAR PRODUCTO
 */
export async function createProduct(data: {
  title: string;
  price: number;
  currency: string;
  category: string;
  description: string;
  images: string[];
}) {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    throw new Error("Debes iniciar sesión para vender");
  }

  const email = user.emailAddresses[0].emailAddress;
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Vendedor Timbiriche";

  const seller = await prisma.seller.upsert({
    where: { email: email },
    update: {},
    create: {
      id: user.id, 
      email: email,
      storeName: userName,
      avatar: user.imageUrl,
      phoneNumber: "",
      isVerified: false,
    },
  });

  await prisma.product.create({
    data: {
      title: data.title,
      price: Math.round(data.price),
      currency: data.currency, 
      description: data.description,
      category: data.category,
      sellerId: seller.id,
      images: {
        create: data.images.map((url) => ({ url })),
      },
    },
  });

  revalidatePath("/");
  return { success: true };
}

/**
 * 5. ACTUALIZAR PRODUCTO
 */
export async function updateProduct(productId: string, data: {
  title: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  images: string[];  // 👈 Debe ser array
  isActive: boolean;
}) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  if (!product || product.seller?.email !== email) {
    throw new Error("No tienes permiso para editar este producto");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      price: Math.round(data.price),
      currency: data.currency,
      description: data.description,
      category: data.category,
      isActive: data.isActive,
      // 👇 VALIDACIÓN: Solo actualizar imágenes si existen
      ...(data.images && data.images.length > 0 && {
        images: {
          deleteMany: {},
          create: data.images.map((url) => ({ url })),
        },
      }),
    },
  });

  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/mis-publicaciones");
  return { success: true };
}

/**
 * 6. ACTUALIZAR PERFIL DE VENDEDOR
 */
export async function updateProfile(data: { storeName: string; phoneNumber: string; avatar?: string }) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;

  await prisma.seller.upsert({
    where: { email },
    update: {
      storeName: data.storeName,
      phoneNumber: data.phoneNumber,
      ...(data.avatar && { avatar: data.avatar }),
    },
    create: {
      id: user.id, 
      email,
      storeName: data.storeName,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar || user.imageUrl,
      isVerified: false,
    },
  });

  revalidatePath("/perfil");
  revalidatePath("/vender");
  revalidatePath("/mis-publicaciones");
  return { success: true };
}

/**
 * 7. ACCIÓN DE SINCRONIZACIÓN (NUEVA)
 * Esta es la que usaremos en el layout para asegurar que el usuario existe en Supabase.
 */
export async function syncUserAction() {
  const user = await currentUser();
  if (!user) return;

  const email = user.emailAddresses[0].emailAddress;

  await prisma.seller.upsert({
    where: { email },
    update: {
      avatar: user.imageUrl, // Mantenemos el avatar fresco
    },
    create: {
      id: user.id,
      email: email,
      storeName: user.firstName || "Mi Tienda",
      avatar: user.imageUrl,
      phoneNumber: "",
      isVerified: false,
    },
  });
}