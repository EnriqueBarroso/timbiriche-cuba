"use server"

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getToken(): Promise<string | null> {
  const { getToken: clerkGetToken } = await auth();
  return clerkGetToken();
}
import {
  getProductsPage,
  getPromotedProducts as apiGetPromotedProducts,
  getFlashOffers as apiGetFlashOffers,
  getSellers,
  getSellerByEmail,
  getSellerProducts,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  createProduct as apiCreateProduct,
  updateSeller,
  toggleFollow as apiToggleFollow,
  checkIfFollowing as apiCheckIfFollowing,
  type ProductFilters,
  type SortOrder,
} from "@/lib/api";

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
  const filters: ProductFilters = {
    type: "MARKETPLACE",
    ...(query && { query }),
    ...(category && category !== "all" && { category }),
    ...(sort && { sort: sort as SortOrder }),
    ...(minPrice !== undefined && { minPrice }),
    ...(maxPrice !== undefined && { maxPrice }),
  };

  const isHomepage =
    !query && !category && page === 1 && !minPrice && !maxPrice && sort === "recent";

  if (isHomepage) {
    try {
      const rawData = await getProductsPage({ ...filters, page: 1, limit: 50 });
      const rawProducts = rawData.products;

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

      return {
        products: mixedProducts,
        total: rawData.total,
        totalPages: rawData.totalPages,
        currentPage: page,
      };
    } catch {
      return { products: [], total: 0, totalPages: 0, currentPage: page };
    }
  }

  try {
    const data = await getProductsPage({ ...filters, page, limit: ITEMS_PER_PAGE });
    return {
      products: data.products,
      total: data.total,
      totalPages: data.totalPages,
      currentPage: page,
    };
  } catch {
    return { products: [], total: 0, totalPages: 0, currentPage: page };
  }
}

// 2. OBTENER MIS PRODUCTOS
export async function getMyProducts() {
  const user = await currentUser();
  if (!user) return [];
  const email = user.emailAddresses[0].emailAddress;
  const seller = await getSellerByEmail(email);
  if (!seller) return [];
  return getSellerProducts(seller.id);
}

// 3. BORRAR PRODUCTO
export async function deleteProduct(productId: string) {
  const user = await currentUser();
  if (!user) return { error: "No autorizado" };
  const email = user.emailAddresses[0].emailAddress;

  const seller = await getSellerByEmail(email);
  if (!seller) return { error: "No se encontró perfil de vendedor" };

  const product = await import("@/lib/api").then((m) => m.getProductById(productId)).catch(() => null);
  if (!product || product.sellerId !== seller.id) {
    return { error: "No tienes permiso para borrar este producto" };
  }

  const token = await getToken();
  await apiDeleteProduct(productId, token ?? undefined);
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
  const seller = await getSellerByEmail(email);

  if (!seller) throw new Error("Debes configurar tu perfil antes de publicar");

  const token = await getToken();
  await apiCreateProduct({
    title: data.title,
    price: data.price,
    currency: data.currency,
    description: data.description,
    category: data.category,
    sellerId: seller.id,
    isFlashOffer: data.isFlashOffer,
    images: data.images,
  }, token ?? undefined);

  revalidatePath("/");
  return { success: true };
}

// 5. ACTUALIZAR PRODUCTO
export async function updateProduct(productId: string, data: {
  title?: string;
  price?: number;
  currency?: string;
  category?: string;
  description?: string;
  isFlashOffer?: boolean;
  images?: string[];
}) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const email = user.emailAddresses[0].emailAddress;

  const seller = await getSellerByEmail(email);
  if (!seller) throw new Error("No se encontró perfil de vendedor");

  const product = await import("@/lib/api").then((m) => m.getProductById(productId)).catch(() => null);
  if (!product || product.sellerId !== seller.id) throw new Error("No tienes permiso");

  const token = await getToken();
  await apiUpdateProduct(productId, data, token ?? undefined);

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

  const seller = await getSellerByEmail(email);
  if (!seller) throw new Error("No se encontró perfil de vendedor");

  const token = await getToken();
  await updateSeller(seller.id, data, token ?? undefined);
  revalidatePath("/perfil");
  revalidatePath(`/vendedor/${seller.slug}`);
}

export async function syncUserAction() {
  const user = await currentUser();
  if (!user) return;
  const email = user.emailAddresses[0].emailAddress;
  const seller = await getSellerByEmail(email);
  if (seller) {
    const token = await getToken();
    await updateSeller(seller.id, { avatar: user.imageUrl }, token ?? undefined);
  }
}

export async function toggleProductStatus(productId: string) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const email = user.emailAddresses[0].emailAddress;

  const seller = await getSellerByEmail(email);
  if (!seller) throw new Error("No se encontró perfil de vendedor");

  const product = await import("@/lib/api").then((m) => m.getProductById(productId)).catch(() => null);
  if (!product || product.sellerId !== seller.id) throw new Error("No tienes permiso");

  const newStatus = !product.isSold;
  const token = await getToken();
  await apiUpdateProduct(productId, { isSold: newStatus }, token ?? undefined);
  revalidatePath("/mis-publicaciones");
  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  return { success: true, isSold: newStatus };
}

export async function getPromotedProducts() {
  try {
    return await apiGetPromotedProducts();
  } catch {
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

  const product = await import("@/lib/api").then((m) => m.getProductById(productId));
  const token = await getToken();
  await apiUpdateProduct(productId, { isPromoted: !product.isPromoted }, token ?? undefined);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, isPromoted: !product.isPromoted };
}

export async function toggleFollowAction(sellerId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  if (user.id === sellerId) return { error: "No puedes seguirte a ti mismo" };

  const token = await getToken();
  const result = await apiToggleFollow(sellerId, user.id, token ?? undefined);
  revalidatePath(`/product/[id]`);
  return result;
}

export async function checkIfFollowing(sellerId: string) {
  const user = await currentUser();
  if (!user) return false;

  const result = await apiCheckIfFollowing(sellerId, user.id);
  return result.isFollowing;
}

export async function getFlashOffers() {
  try {
    return await apiGetFlashOffers();
  } catch {
    return [];
  }
}

export async function injectMenuHacker(jsonData: string) {
  const user = await currentUser();
  if (!user || user.emailAddresses[0].emailAddress !== process.env.ADMIN_EMAIL) {
    throw new Error("Acceso denegado: Solo el admin puede inyectar menús");
  }

  const data = JSON.parse(jsonData);
  const { emailDueño, platos } = data;

  const seller = await getSellerByEmail(emailDueño);
  if (!seller) throw new Error(`No se encontró ningún vendedor con el email: ${emailDueño}`);
  if (!seller.isRestaurant)
    throw new Error("¡Cuidado! Este usuario está registrado como tienda, no como restaurante.");

  const token = await getToken();
  let count = 0;
  for (const plato of platos) {
    await apiCreateProduct({
      title: plato.title,
      price: Number(plato.price),
      currency: "USD",
      category: plato.categoria || "Otros",
      type: "EATS",
      description: plato.description,
      sellerId: seller.id,
      isFlashOffer: false,
      images: [plato.imageUrl || "https://via.placeholder.com/400"],
    }, token ?? undefined);
    count++;
  }

  revalidatePath("/");
  revalidatePath("/eats");
  return { success: true, message: `¡Magia pura! ${count} platos inyectados correctamente.` };
}

export async function createProductAdmin(data: {
  sellerId: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
}) {
  const user = await currentUser();
  if (!user || user.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    throw new Error("Acceso denegado: Solo el admin puede crear productos desde este panel");
  }

  const token = await getToken();
  await apiCreateProduct({
    title: data.title,
    price: data.price,
    currency: "USD",
    category: data.category,
    description: data.description ?? "",
    sellerId: data.sellerId,
    type: "MARKETPLACE",
    isFlashOffer: false,
    images: [data.imageUrl],
  }, token ?? undefined);

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, message: "Producto creado correctamente." };
}

export async function getGroupedSellers() {
  try {
    const sellers = await getSellers({ isFeatured: true });
    return sellers
      .filter((s) => s.products && s.products.length > 0)
      .sort((a, b) => b._count.products - a._count.products);
  } catch {
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

  const seller = await import("@/lib/api").then((m) => m.getSellerById(sellerId));
  const token = await getToken();
  const updated = await updateSeller(sellerId, { isFeatured: !seller.isFeatured }, token ?? undefined);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, isFeatured: updated.isFeatured };
}
