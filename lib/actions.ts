"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

// 1. OBTENER PRODUCTOS (CON PAGINACIÓN)
// 1. OBTENER PRODUCTOS (CON PAGINACIÓN Y ANTI-MONOPOLIO B2B)
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
  } else {
    where.category = { not: "wholesale" };
  }

  try {
    const filtroFinal = {
      ...where,
      type: 'MARKETPLACE',
      seller: {
        ...(where.seller || {}),
        isRestaurant: false
      }
    };

    // 🔥 ALGORITMO ANTI-MONOPOLIO 🔥
    // Si estamos en la portada pura (sin filtros ni búsquedas)
    const isHomepage = !query && !category && page === 1;

    if (isHomepage) {
      // 1. Traemos un lote grande (ej. 50) para tener variedad de donde escoger
      const rawProducts = await prisma.product.findMany({
        where: filtroFinal,
        take: 50, // Traemos más de lo necesario para mezclar
        orderBy: { createdAt: "desc" },
        include: { images: true, seller: true },
      });

      // 2. Filtramos en memoria: Máximo 2 productos por tienda en la portada
      const sellerCounts: Record<string, number> = {};
      const mixedProducts: typeof rawProducts = [];

      for (const product of rawProducts) {
        const sId = product.sellerId ?? "unknown";
        sellerCounts[sId] = (sellerCounts[sId] || 0) + 1;

        if (sellerCounts[sId] <= 2) { // <- LÍMITE: 2 productos por vendedor
          mixedProducts.push(product);
        }

        // Si ya llenamos la página, paramos
        if (mixedProducts.length === ITEMS_PER_PAGE) break;
      }

      // Si después del filtro no llegamos a ITEMS_PER_PAGE, rellenamos con lo que haya
      if (mixedProducts.length < ITEMS_PER_PAGE && rawProducts.length > mixedProducts.length) {
        const remainingNeeded = ITEMS_PER_PAGE - mixedProducts.length;
        const remainingProducts = rawProducts.filter(p => !mixedProducts.includes(p)).slice(0, remainingNeeded);
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

    // 🔄 COMPORTAMIENTO NORMAL (Si el usuario busca o filtra por categoría, mostramos TODO)
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filtroFinal,
        take: ITEMS_PER_PAGE,
        skip: skip,
        orderBy: { createdAt: "desc" },
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

// 4. CREAR PRODUCTO (SIMPLIFICADO: Guardamos el precio tal cual)
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

  // 👇 AQUÍ ESTÁ EL CAMBIO: Guardamos data.price directo. Sin multiplicar.
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
      ...(data.isFlashOffer !== undefined && { isFlashOffer: data.isFlashOffer }),
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

// 6. ACTUALIZAR PERFIL (CON PROTECCIÓN ANTI-SUPLANTACIÓN)
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

  // PROTECCIÓN: Verificar que no estamos sobrescribiendo otra cuenta
  const existingSeller = await prisma.seller.findFirst({
    where: {
      email: { not: email },
      OR: [
        { storeName: data.storeName },
      ]
    }
  });

  if (existingSeller) {
    throw new Error("Ya existe una tienda con ese nombre. Usa /vendedor/[slug]/editar para editar tiendas de otros vendedores.");
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
      where: { isPromoted: true, isSold: false, type: 'MARKETPLACE' },
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

/**
 * 12. OBTENER OFERTAS FLASH (Controladas por vendedores)
 */
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

// 13. SCRIPT HACKER: INYECTAR MENÚ COMPLETO
export async function injectMenuHacker(jsonData: string) {
  // Asegurarnos de que solo el admin pueda correr esto
  const user = await currentUser();
  if (!user || user.emailAddresses[0].emailAddress !== process.env.ADMIN_EMAIL) {
    throw new Error("Acceso denegado: Solo el admin puede inyectar menús");
  }

  try {
    const data = JSON.parse(jsonData);
    const { emailDueño, platos } = data;

    // 1. Buscamos al restaurante en la base de datos
    const seller = await prisma.seller.findUnique({
      where: { email: emailDueño }
    });

    if (!seller) {
      throw new Error(`No se encontró ningún vendedor con el email: ${emailDueño}`);
    }

    if (!seller.isRestaurant) {
      throw new Error("¡Cuidado! Este usuario está registrado como tienda, no como restaurante.");
    }

    // 2. Inyectamos los platos uno por uno a la velocidad de la luz
    let count = 0;
    for (const plato of platos) {
      await prisma.product.create({
        data: {
          title: plato.title,
          price: Number(plato.price),
          currency: "USD",

          // 👇 LA MAGIA AQUÍ: Leemos la categoría del JSON, si no trae, le ponemos "Otros"
          category: plato.categoria || "Otros",
          type: 'EATS',

          description: plato.description,
          sellerId: seller.id,
          isFlashOffer: false,
          images: {
            create: [{ url: plato.imageUrl || "https://via.placeholder.com/400" }]
          }
        }
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

// 14. OBTENER TIENDAS DESTACADAS (Marketplace)
export async function getFeaturedSellers() {
  try {
    return await prisma.seller.findMany({
      where: {
        isRestaurant: false,
        isFeatured: true, // 👈 AHORA SOLO TRAE LAS QUE TÚ HAYAS MARCADO
        products: {
          some: { type: 'MARKETPLACE' }
        }
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { products: { where: { type: 'MARKETPLACE' } } } }
      }
    });
  } catch (error) {
    console.error("Error cargando tiendas destacadas:", error);
    return [];
  }
}

// 15. DESTACAR / QUITAR DE DESTACADOS A UN VENDEDOR (Solo Admin)
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
  revalidatePath("/admin"); // Asumiendo que tu panel está en /admin
  return { success: true, isFeatured: updated.isFeatured };
}