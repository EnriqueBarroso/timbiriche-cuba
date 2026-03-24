"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

// ============================================================
// 1. OBTENER PRODUCTOS (CON PAGINACIÓN, ANTI-MONOPOLIO Y FILTROS)
// ============================================================
export async function getProducts({
  query,
  category,
  page = 1,
  sort = "recent",
  minPrice,
  maxPrice,
}: {
  query?: string;
  category?: string;
  page?: number;
  sort?: "recent" | "price_asc" | "price_desc";
  minPrice?: number;
  maxPrice?: number;
}) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isSold: false };

  if (query) {
    const searchTerms = query.trim().split(/\s+/).join(" & ");
    where.OR = [
      { title: { search: searchTerms } },
      { description: { search: searchTerms } },
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.category = { equals: category, mode: "insensitive" };
  } else {
    where.category = { not: "wholesale" };
  }

  // Rango de precios — ignoramos precio 0 (productos con "Varios Precios")
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && minPrice > 0 && { gte: minPrice }),
      ...(maxPrice !== undefined && maxPrice > 0 && { lte: maxPrice }),
    };
  }

  // Ordenamiento
  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  try {
    const filtroFinal = {
      ...where,
      type: "MARKETPLACE",
      seller: {
        ...(where.seller || {}),
        isRestaurant: false,
      },
    };

    // 🔥 ALGORITMO ANTI-MONOPOLIO — solo en portada pura (sin filtros activos)
    const isHomepage =
      !query && !category && page === 1 && !minPrice && !maxPrice && sort === "recent";

    if (isHomepage) {
      const rawProducts = await prisma.product.findMany({
        where: filtroFinal,
        take: 50,
        orderBy,
        include: { images: true, seller: true },
      });

      const sellerCounts: Record<string, number> = {};
      const mixedProducts: typeof rawProducts = [];

      for (const product of rawProducts) {
        const sId = product.sellerId ?? "unknown";
        sellerCounts[sId] = (sellerCounts[sId] || 0) + 1;
        if (sellerCounts[sId] <= 2) mixedProducts.push(product);
        if (mixedProducts.length === ITEMS_PER_PAGE) break;
      }

      if (mixedProducts.length < ITEMS_PER_PAGE && rawProducts.length > mixedProducts.length) {
        const remainingNeeded = ITEMS_PER_PAGE - mixedProducts.length;
        const remainingProducts = rawProducts
          .filter((p) => !mixedProducts.includes(p))
          .slice(0, remainingNeeded);
        mixedProducts.push(...remainingProducts);
      }

      const total = await prisma.product.count({ where: filtroFinal });

      return {
        products: mixedProducts,
        total,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        currentPage: page,
      };
    }

    // 🔄 COMPORTAMIENTO NORMAL (filtros, búsqueda, ordenamiento)
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filtroFinal,
        take: ITEMS_PER_PAGE,
        skip,
        orderBy,
        include: { images: true, seller: true },
      }),
      prisma.product.count({ where: filtroFinal }),
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

// 4. CREAR PRODUCTO
export async function createProduct(data: {
  title: string;
  price: number;
  currency: string;
  category: string;
  description: string;
  images: string[];
  isFlashOffer: boolean;
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
      slug: generateSlug(userName),
      avatar: user.imageUrl,
      phoneNumber: "",
      isVerified: false,
    },
  });

  await prisma.product.create({
    data: {
      title: data.title,
      price: data.price,
      currency: data.currency,
      description: data.description,
      category: data.category,
      sellerId: seller.id,
      isFlashOffer: data.isFlashOffer,
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
    include: { seller: true },
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
      ...(data.isFlashOffer !== undefined && { isFlashOffer: data.isFlashOffer }),
      ...(data.images && {
        images: {
          deleteMany: {},
          create: data.images.map((url: string) => ({ url })),
        },
      }),
    },
  });

  revalidatePath("/mis-publicaciones");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/");
}

// 6. ACTUALIZAR PERFIL
export async function updateProfile(data: {
  storeName: string;
  phoneNumber: string;
  avatar?: string;
  acceptsZelle?: boolean;
  zelleEmail?: string;
  isRestaurant?: boolean;
}) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const email = user.emailAddresses[0].emailAddress;

  const existingSeller = await prisma.seller.findFirst({
    where: {
      email: { not: email },
      OR: [{ storeName: data.storeName }],
    },
  });

  if (existingSeller) {
    throw new Error(
      "Ya existe una tienda con ese nombre. Usa /vendedor/[slug]/editar para editar tiendas de otros vendedores."
    );
  }
}

export async function syncUserAction() {
  const user = await currentUser();
  if (!user) return;
  const email = user.emailAddresses[0].emailAddress;
  await prisma.seller.upsert({
    where: { email },
    update: { avatar: user.imageUrl },
    create: {
      id: user.id,
      email: email,
      storeName: user.firstName || "Mi Tienda",
      slug: generateSlug(user.firstName || "mi-tienda"),
      avatar: user.imageUrl,
      phoneNumber: "",
      isVerified: false,
    },
  });
}

export async function toggleProductStatus(productId: string) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const email = user.emailAddresses[0].emailAddress;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true },
  });
  if (!product || !product.seller || product.seller.email !== email)
    throw new Error("No tienes permiso");
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
      where: { isPromoted: true, isSold: false, type: "MARKETPLACE" },
      include: { images: true, seller: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return [];
  }
}

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

export async function toggleFollowAction(sellerId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const followerId = user.id;
  if (followerId === sellerId) return { error: "No puedes seguirte a ti mismo" };

  const existingFollow = await prisma.follower.findUnique({
    where: { followerId_sellerId: { followerId, sellerId } },
  });

  if (existingFollow) {
    await prisma.follower.delete({
      where: { followerId_sellerId: { followerId, sellerId } },
    });
    revalidatePath(`/product/[id]`);
    return { isFollowing: false };
  } else {
    await prisma.follower.create({ data: { followerId, sellerId } });
    revalidatePath(`/product/[id]`);
    return { isFollowing: true };
  }
}

export async function checkIfFollowing(sellerId: string) {
  const user = await currentUser();
  if (!user) return false;

  const follow = await prisma.follower.findUnique({
    where: { followerId_sellerId: { followerId: user.id, sellerId } },
  });

  return !!follow;
}

export async function getFlashOffers() {
  try {
    return await prisma.product.findMany({
      where: { isFlashOffer: true, isSold: false },
      include: { images: true, seller: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return [];
  }
}

export async function injectMenuHacker(jsonData: string) {
  const user = await currentUser();
  if (!user || user.emailAddresses[0].emailAddress !== process.env.ADMIN_EMAIL) {
    throw new Error("Acceso denegado: Solo el admin puede inyectar menús");
  }

  try {
    const data = JSON.parse(jsonData);
    const { emailDueño, platos } = data;

    const seller = await prisma.seller.findUnique({ where: { email: emailDueño } });
    if (!seller) throw new Error(`No se encontró ningún vendedor con el email: ${emailDueño}`);
    if (!seller.isRestaurant)
      throw new Error("¡Cuidado! Este usuario está registrado como tienda, no como restaurante.");

    let count = 0;
    for (const plato of platos) {
      await prisma.product.create({
        data: {
          title: plato.title,
          price: Number(plato.price),
          currency: "USD",
          category: plato.categoria || "Otros",
          type: "EATS",
          description: plato.description,
          sellerId: seller.id,
          isFlashOffer: false,
          images: {
            create: [{ url: plato.imageUrl || "https://via.placeholder.com/400" }],
          },
        },
      });
      count++;
    }

    revalidatePath("/");
    revalidatePath("/eats");
    return { success: true, message: `¡Magia pura! ${count} platos inyectados correctamente.` };
  } catch (error) {
    console.error("Error inyectando:", error);
    throw new Error(error instanceof Error ? error.message : "Error procesando el JSON");
  }
}

export async function getFeaturedSellers() {
  try {
    return await prisma.seller.findMany({
      where: {
        isRestaurant: false,
        isFeatured: true,
        products: { some: { type: "MARKETPLACE" } },
      },
      take: 6,
      orderBy: { products: { _count: "desc" } },
      include: {
        _count: { select: { products: { where: { type: "MARKETPLACE" } } } },
      },
    });
  } catch (error) {
    console.error("Error cargando tiendas destacadas:", error);
    return [];
  }
}

export async function toggleSellerFeaturedStatus(sellerId: string) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;
  if (email !== process.env.ADMIN_EMAIL) {
    throw new Error("Solo el administrador puede destacar tiendas");
  }

  const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
  if (!seller) throw new Error("Vendedor no encontrado");

  const updated = await prisma.seller.update({
    where: { id: sellerId },
    data: { isFeatured: !seller.isFeatured },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, isFeatured: updated.isFeatured };
}
