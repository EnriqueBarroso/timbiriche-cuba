"use server"

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"; // 👈 Añadimos currentUser
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 12;

// 1. Función para dar/quitar Like (AHORA CORREGIDA)
export async function toggleFavorite(productId: string) {
  // Obtenemos los datos completos del usuario desde Clerk
  const userClerk = await currentUser();
  
  if (!userClerk) return { error: "Debes iniciar sesión" };

  const userId = userClerk.id;
  const userEmail = userClerk.emailAddresses[0]?.emailAddress || "no-email@timbiriche.com";

  // PASO CRÍTICO: Asegurarnos de que el usuario existe en NUESTRA base de datos
  // Usamos "upsert": Si existe no hace nada (update vacío), si no existe lo crea.
  await prisma.user.upsert({
    where: { id: userId },
    update: {}, 
    create: {
      id: userId,
      email: userEmail,
    },
  });

  // AHORA SÍ: Ya podemos gestionar el favorito sin que la base de datos se queje
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  revalidatePath("/");
}

// 2. Actualizamos getProducts (Igual que antes)
export async function getProducts({
  query,
  category,
  page = 1,
}: {
  query?: string;
  category?: string;
  page?: number;
}) {
  const { userId } = await auth();
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
        favorites: {
          where: { userId: userId || "no-user" }, 
        },
      },
    });

    return products.map(product => ({
      ...product,
      isFavorite: product.favorites.length > 0,
    }));

  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export async function getMyFavorites() {
  const { userId } = await auth();
  
  if (!userId) return [];

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          include: {
            images: true,
            seller: true,
            favorites: {
              where: { userId: userId },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Limpiamos el resultado para devolver solo la lista de productos
    return favorites.map((fav) => ({
      ...fav.product,
      isFavorite: true, // Obviamente es favorito porque está en esta lista
    }));

  } catch (error) {
    console.error("Error cargando favoritos:", error);
    return [];
  }
}

// 1. Obtener mis productos en venta
export async function getMyProducts() {
  const { userId } = await auth();
  if (!userId) return [];

  return await prisma.product.findMany({
    where: { sellerId: userId }, // Filtramos por TU id
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      favorites: true, // Para saber cuántos likes tiene
    },
  });
}

// 2. Borrar un producto (Solo si es mío)
export async function deleteProduct(productId: string) {
  const user = await currentUser(); // Usamos currentUser para sacar el email
  if (!user) return { error: "No autorizado" };

  const email = user.emailAddresses[0].emailAddress;

  // 1. Buscamos quién es el VENDEDOR asociado a este email
  const seller = await prisma.seller.findUnique({
    where: { email },
  });

  if (!seller) return { error: "No se encontró perfil de vendedor" };

  // 2. Buscamos el producto
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  // 3. Verificamos: ¿El dueño del producto es este Vendedor?
  if (!product || product.sellerId !== seller.id) {
    return { error: "No puedes borrar esto, no es tuyo" };
  }

  // 4. Borramos
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/mis-publicaciones");
}