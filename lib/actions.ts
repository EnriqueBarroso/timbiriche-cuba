"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 12;

// 1. OBTENER PRODUCTOS (CON PAGINACIÓN)
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
  const where: any = { isSold: false };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
    ];
  }

  // 👇 AQUÍ ESTÁ LA MAGIA B2B
  if (category && category !== "all") {
    where.category = { equals: category, mode: "insensitive" };
  } else {
    // Si NO hay categoría seleccionada (es decir, estamos en el Inicio normal),
    // filtramos para que NO salgan los productos mayoristas.
    where.category = { not: "wholesale" };
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: ITEMS_PER_PAGE,
        skip: skip,
        orderBy: { createdAt: "desc" },
        include: { images: true, seller: true },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error cargando productos:", error);
    return { products: [], total: 0, totalPages: 0, currentPage: page };
  }
}

// 2. OBTENER MIS PRODUCTOS
export async function getMyProducts() {
  const user = await currentUser();
  if (!user) return [];
  const email = user.emailAddresses[0].emailAddress;
  return await prisma.product.findMany({
    where: { seller: { email: email } },
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });
}

// 3. BORRAR PRODUCTO
export async function deleteProduct(productId: string) {
  const user = await currentUser();
  if (!user) return { error: "No autorizado" };
  const email = user.emailAddresses[0].emailAddress;

  const seller = await prisma.seller.findUnique({ where: { email } });
  if (!seller) return { error: "No se encontró perfil de vendedor" };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.sellerId !== seller.id) {
    return { error: "No tienes permiso para borrar este producto" };
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/mis-publicaciones");
  return { success: true };
}

// 4. CREAR PRODUCTO (SIMPLIFICADO: Guardamos el precio tal cual)
export async function createProduct(data: {
  title: string;
  price: number;
  currency: string;
  category: string;
  description: string;
  images: string[];
}) {
  const user = await currentUser();
  if (!user || !user.emailAddresses[0]) throw new Error("Debes iniciar sesión");

  const email = user.emailAddresses[0].emailAddress;
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Vendedor LaChopin";

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

  // 👇 AQUÍ ESTÁ EL CAMBIO: Guardamos data.price directo. Sin multiplicar.
  await prisma.product.create({
    data: {
      title: data.title,
      price: data.price, 
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

// 5. ACTUALIZAR PRODUCTO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(productId: string, data: any) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const email = user.emailAddresses[0].emailAddress;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  if (!product || !product.seller || product.seller.email !== email) {
    throw new Error("No tienes permiso");
  }
  
  await prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      ...(data.price !== undefined && { price: data.price }),
      currency: data.currency,
      category: data.category,
      description: data.description,
      // Si recibimos el array de imágenes del cliente, actualizamos la galería
      ...(data.images && {
        images: {
            deleteMany: {}, // Borramos las relaciones viejas para evitar "fotos huérfanas"
            create: data.images.map((url: string) => ({ url })) // Creamos las relaciones con el array final
        }
      })
    }
  });

  revalidatePath("/mis-publicaciones");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/");
}

// ... Resto de funciones (updateProfile, syncUserAction, etc.) ...
// Puedes dejar las que ya tenías, no han cambiado.
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
      id: user.id, email,
      storeName: data.storeName,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar || user.imageUrl, isVerified: false,
    },
  });
  revalidatePath("/perfil");
  revalidatePath("/vender");
  revalidatePath("/mis-publicaciones");
  return { success: true };
}

export async function syncUserAction() {
  const user = await currentUser();
  if (!user) return;
  const email = user.emailAddresses[0].emailAddress;
  await prisma.seller.upsert({
    where: { email },
    update: { avatar: user.imageUrl },
    create: {
      id: user.id, email: email,
      storeName: user.firstName || "Mi Tienda",
      avatar: user.imageUrl, phoneNumber: "", isVerified: false,
    },
  });
}

export async function toggleProductStatus(productId: string) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const email = user.emailAddresses[0].emailAddress;
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { seller: true } });
  if (!product || !product.seller || product.seller.email !== email) throw new Error("No tienes permiso");
  const newStatus = !product.isSold;
  await prisma.product.update({ where: { id: productId }, data: { isSold: newStatus } });
  revalidatePath("/mis-publicaciones");
  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  return { success: true, isSold: newStatus };
}

export async function getPromotedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isPromoted: true, isSold: false },
      include: { images: true, seller: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) { return []; }
}

// TOGGLE PROMOTED STATUS (Solo Admin)
export async function togglePromotedStatus(productId: string) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;
  if (email !== process.env.ADMIN_EMAIL) {
    throw new Error("Solo el administrador puede promocionar productos");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Producto no encontrado");

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { isPromoted: !product.isPromoted },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, isPromoted: updated.isPromoted };
}

/**
 * 10. SEGUIR / DEJAR DE SEGUIR VENDEDOR
 */
export async function toggleFollowAction(sellerId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const followerId = user.id;

  // No puedes seguirte a ti mismo
  if (followerId === sellerId) return { error: "No puedes seguirte a ti mismo" };

  // Verificamos si ya lo sigue
  const existingFollow = await prisma.follower.findUnique({
    where: {
      followerId_sellerId: {
        followerId,
        sellerId,
      },
    },
  });

  if (existingFollow) {
    // Si existe -> BORRAR (Dejar de seguir)
    await prisma.follower.delete({
      where: {
        followerId_sellerId: {
          followerId,
          sellerId,
        },
      },
    });
    revalidatePath(`/product/[id]`); // Actualizar caché
    return { isFollowing: false };
  } else {
    // Si no existe -> CREAR (Seguir)
    await prisma.follower.create({
      data: {
        followerId,
        sellerId,
      },
    });
    revalidatePath(`/product/[id]`);
    return { isFollowing: true };
  }
}

/**
 * 11. COMPROBAR SI SIGO A UN VENDEDOR
 */
export async function checkIfFollowing(sellerId: string) {
  const user = await currentUser();
  if (!user) return false;

  const follow = await prisma.follower.findUnique({
    where: {
      followerId_sellerId: {
        followerId: user.id,
        sellerId: sellerId,
      },
    },
  });

  return !!follow; // Retorna true si existe, false si no
}