"use server"

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/utils";

async function getToken(): Promise<string | null> {
  const { getToken: clerkGetToken } = await auth();
  return clerkGetToken();
}

// Centraliza el check de admin usado por las acciones de /admin.
// Lanza si el usuario actual no es el administrador (mismo criterio que isAdmin).
async function requireAdmin(): Promise<void> {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!isAdmin(email)) {
    throw new Error("Acceso denegado: Solo el administrador puede realizar esta acción.");
  }
}
import {
  getProductsPage,
  getPromotedProducts as apiGetPromotedProducts,
  getFlashOffers as apiGetFlashOffers,
  getBusinesses,
  getBusinessByEmail,
  getBusinessByOwnerId,
  getBusinessProducts,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  createProduct as apiCreateProduct,
  createBusiness as apiCreateBusiness,
  updateBusiness,
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

      const businessCounts: Record<string, number> = {};
      const mixedProducts: typeof rawProducts = [];

      for (const product of rawProducts) {
        const sId = product.businessId ?? "unknown";
        businessCounts[sId] = (businessCounts[sId] || 0) + 1;
        if (businessCounts[sId] <= 2) mixedProducts.push(product);
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
  const business = await getBusinessByOwnerId(user.id);
  if (!business) return [];
  return getBusinessProducts(business.id);
}

// 3. BORRAR PRODUCTO
export async function deleteProduct(productId: string) {
  const user = await currentUser();
  if (!user) return { error: "No autorizado" };

  const business = await getBusinessByOwnerId(user.id);
  if (!business) return { error: "No se encontró perfil de vendedor" };

  const product = await import("@/lib/api").then((m) => m.getProductById(productId)).catch(() => null);
  if (!product || product.businessId !== business.id) {
    return { error: "No tienes permiso para borrar este producto" };
  }

  const token = await getToken();
  await apiDeleteProduct(productId, token ?? undefined);
  revalidatePath("/");
  revalidatePath("/mis-publicaciones");
  revalidatePath(`/vendedor/${business.slug}/productos`);
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
  if (!user) throw new Error("Debes iniciar sesión");

  const business = await getBusinessByOwnerId(user.id);

  if (!business) throw new Error("Debes configurar tu perfil antes de publicar");

  const token = await getToken();
  await apiCreateProduct({
    title: data.title,
    price: data.price,
    currency: data.currency,
    description: data.description,
    category: data.category,
    businessId: business.id,
    isFlashOffer: data.isFlashOffer,
    images: data.images,
  }, token ?? undefined);

  revalidatePath("/");
  revalidatePath(`/vendedor/${business.slug}/productos`);
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

  const business = await getBusinessByOwnerId(user.id);
  if (!business) throw new Error("No se encontró perfil de vendedor");

  const product = await import("@/lib/api").then((m) => m.getProductById(productId)).catch(() => null);
  if (!product || product.businessId !== business.id) throw new Error("No tienes permiso");

  const token = await getToken();
  await apiUpdateProduct(productId, data, token ?? undefined);

  revalidatePath("/mis-publicaciones");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/");
  revalidatePath(`/vendedor/${business.slug}/productos`);
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

  const business = await getBusinessByOwnerId(user.id);
  if (!business) throw new Error("No se encontró perfil de vendedor");

  const token = await getToken();
  await updateBusiness(business.id, data, token ?? undefined);
  revalidatePath("/perfil");
  revalidatePath(`/vendedor/${business.slug}`);
}

export async function syncUserAction() {
  const user = await currentUser();
  if (!user) return;
  const business = await getBusinessByOwnerId(user.id);
  if (business) {
    const token = await getToken();
    await updateBusiness(business.id, { avatar: user.imageUrl }, token ?? undefined);
  }
}

export async function toggleProductStatus(productId: string) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const business = await getBusinessByOwnerId(user.id);
  if (!business) throw new Error("No se encontró perfil de vendedor");

  const product = await import("@/lib/api").then((m) => m.getProductById(productId)).catch(() => null);
  if (!product || product.businessId !== business.id) throw new Error("No tienes permiso");

  const newStatus = !product.isSold;
  const token = await getToken();
  await apiUpdateProduct(productId, { isSold: newStatus }, token ?? undefined);
  revalidatePath("/mis-publicaciones");
  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  revalidatePath(`/vendedor/${business.slug}/productos`);
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
  await requireAdmin();

  const product = await import("@/lib/api").then((m) => m.getProductById(productId));
  const token = await getToken();
  await apiUpdateProduct(productId, { isPromoted: !product.isPromoted }, token ?? undefined);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, isPromoted: !product.isPromoted };
}

export async function toggleFollowAction(businessId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  if (user.id === businessId) return { error: "No puedes seguirte a ti mismo" };

  const token = await getToken();
  const result = await apiToggleFollow(businessId, user.id, token ?? undefined);
  revalidatePath(`/product/[id]`);
  return result;
}

export async function checkIfFollowing(businessId: string) {
  const user = await currentUser();
  if (!user) return false;

  const result = await apiCheckIfFollowing(businessId, user.id);
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
  await requireAdmin();

  const data = JSON.parse(jsonData);
  const { emailDueño, platos } = data;

  const business = await getBusinessByEmail(emailDueño);
  if (!business) throw new Error(`No se encontró ningún vendedor con el email: ${emailDueño}`);
  if (!business.isRestaurant)
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
      businessId: business.id,
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
  businessId: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
}) {
  await requireAdmin();

  const token = await getToken();
  await apiCreateProduct({
    title: data.title,
    price: data.price,
    currency: "USD",
    category: data.category,
    description: data.description || "Sin descripción",
    businessId: data.businessId,
    type: "MARKETPLACE",
    isFlashOffer: false,
    images: [data.imageUrl],
  }, token ?? undefined);

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, message: "Producto creado correctamente." };
}

export async function createBusinessAdmin(data: {
  storeName: string;
  email: string;
  phoneNumber?: string;
  description?: string;
  isRestaurant?: boolean;
  isWholesale?: boolean;
}) {
  await requireAdmin();

  const token = await getToken();
  const { business } = await apiCreateBusiness({
    storeName: data.storeName,
    email: data.email,
    phoneNumber: data.phoneNumber || undefined,
    description: data.description || undefined,
  }, token ?? undefined);

  await updateBusiness(business.id, {
    isVerified: true,
    ...(data.isRestaurant && { isRestaurant: true }),
    ...(data.isWholesale && { isWholesale: true }),
  }, token ?? undefined);

  revalidatePath("/admin");
  revalidatePath("/admin/businesses");
  revalidatePath("/admin/products");
  return { success: true, message: "Vendedor creado correctamente." };
}

export async function getGroupedBusinesses() {
  try {
    const businesses = await getBusinesses({ isFeatured: true });
    return businesses
      .filter((s) => s.products && s.products.length > 0)
      .sort((a, b) => b._count.products - a._count.products);
  } catch {
    return [];
  }
}

export async function toggleBusinessFeaturedStatus(businessId: string) {
  await requireAdmin();

  const business = await import("@/lib/api").then((m) => m.getBusinessById(businessId));
  const token = await getToken();
  const updated = await updateBusiness(businessId, { isFeatured: !business.isFeatured }, token ?? undefined);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, isFeatured: updated.isFeatured };
}
