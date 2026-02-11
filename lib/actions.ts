"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 12;

// 1. OBTENER PRODUCTOS
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

  if (category && category !== "all") {
    where.category = { equals: category, mode: "insensitive" };
  }

  try {
    const products = await prisma.product.findMany({
      where, 
      take: ITEMS_PER_PAGE,
      skip: skip,
      orderBy: { createdAt: "desc" },
      include: { images: true, seller: true },
    });
    return products;
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
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

// 5. ACTUALIZAR PRODUCTO (SIMPLIFICADO)
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
      // 👇 AQUÍ TAMBIÉN: Guardamos directo si hay cambio de precio
      ...(data.price && { price: data.price }),
      currency: data.currency,
      category: data.category,
      description: data.description,
      ...(data.images && data.images.length > 0 && {
        images: {
            deleteMany: {},
            create: data.images.map((url: string) => ({ url }))
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