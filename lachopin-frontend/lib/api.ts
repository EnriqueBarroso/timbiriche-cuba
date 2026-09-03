// ---------------------------------------------------------------------------
// Plain TypeScript types — mirrors what the NestJS API returns
// ---------------------------------------------------------------------------

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface BusinessInProduct {
  id: string;
  storeName: string;
  slug: string | null;
  avatar: string | null;
  phoneNumber: string;
  isVerified: boolean;
  isRestaurant: boolean;
  rating: number;
  acceptsZelle: boolean;
  zelleEmail: string | null;
}

export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  type: string;
  isActive: boolean;
  isSold: boolean;
  isPromoted: boolean;
  isFlashOffer: boolean;
  views: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  business: BusinessInProduct;
}

export interface ProductInBusiness {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  type: string;
  isActive: boolean;
  isSold: boolean;
  isPromoted: boolean;
  isFlashOffer: boolean;
  views: number;
  createdAt: string;
  images: ProductImage[];
}

export interface ApiBusiness {
  id: string;
  storeName: string;
  description: string | null;
  email: string;
  slug: string | null;
  isWholesale: boolean;
  avatar: string | null;
  coverImage: string | null;
  phoneNumber: string;
  address: string | null;
  openTime: string | null;
  closeTime: string | null;
  isVerified: boolean;
  isRestaurant: boolean;
  isFeatured: boolean;
  rating: number;
  acceptsZelle: boolean;
  zelleEmail: string | null;
  cupExchangeRate: number | null;
  createdAt: string;
  products: ProductInBusiness[];
  _count: {
    followers: number;
    products: number;
  };
}

export interface ApiFollowing {
  followerId: string;
  businessId: string;
  business: {
    id: string;
    storeName: string;
    slug: string | null;
    avatar: string | null;
    _count: { products: number };
  };
}

export interface ApiOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  buyerId: string;
  productId: string;
  businessId: string;
  product: { id: string; title: string; price: number; currency: string };
  business: { id: string; storeName: string; slug: string | null; avatar: string | null };
}

export interface ProductsPage {
  products: ApiProduct[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type ProductType = 'MARKETPLACE' | 'EATS';
export type SortOrder = 'recent' | 'price_asc' | 'price_desc';

export interface ProductFilters {
  type?: ProductType;
  isPromoted?: boolean;
  isFlashOffer?: boolean;
  category?: string;
  query?: string;
  sort?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
  businessId?: string;
}

export interface UpdateProductPayload {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  isSold?: boolean;
  isPromoted?: boolean;
  isActive?: boolean;
  isFlashOffer?: boolean;
  images?: string[];
}

export interface UpdateBusinessPayload {
  storeName?: string;
  email?: string;
  phoneNumber?: string;
  isWholesale?: boolean;
  avatar?: string;
  coverImage?: string;
  address?: string;
  openTime?: string;
  closeTime?: string;
  acceptsZelle?: boolean;
  zelleEmail?: string;
  isVerified?: boolean;
  isRestaurant?: boolean;
  isFeatured?: boolean;
  cupExchangeRate?: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function normalizeApiUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}
const BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001');

interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  token?: string;
}

async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  const { token, headers: extraHeaders, ...init } = options ?? {};
  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...extraHeaders,
      },
    });
  } catch (err) {
    console.error(`[apiFetch] fetch failed — URL: ${url}`, err);
    throw err;
  }

  if (!res.ok) {
    let message = `Error ${res.status} en ${path}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // response without JSON body — use default message
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

function buildQuery(filters: Record<string, string | boolean | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProducts(filters?: ProductFilters): Promise<ApiProduct[]> {
  const query = buildQuery({ ...filters });
  return apiFetch<ApiProduct[]>(`/products${query}`);
}

export async function getProductsPage(
  filters: ProductFilters & { page: number; limit?: number },
): Promise<ProductsPage> {
  const query = buildQuery({ ...filters });
  return apiFetch<ProductsPage>(`/products${query}`);
}

export async function getPromotedProducts(): Promise<ApiProduct[]> {
  return getProducts({ isPromoted: true, type: 'MARKETPLACE' });
}

export async function getFlashOffers(): Promise<ApiProduct[]> {
  return getProducts({ isFlashOffer: true });
}

export async function getProductById(id: string): Promise<ApiProduct> {
  if (!id) throw new Error('getProductById: id es requerido.');
  return apiFetch<ApiProduct>(`/products/${id}`);
}

export async function recordProductView(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/products/${id}/view`, { method: 'POST' });
}

export async function updateProduct(
  id: string,
  data: UpdateProductPayload,
  token?: string,
): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteProduct(id: string, token?: string): Promise<void> {
  await apiFetch<{ message: string }>(`/products/${id}`, { method: 'DELETE', token });
}

export async function createProduct(
  data: {
    title: string;
    description?: string;
    price: number;
    currency?: string;
    category: string;
    businessId: string;
    type?: ProductType;
    isFlashOffer?: boolean;
    images?: string[];
  },
  token?: string,
): Promise<{ message: string; product: ApiProduct }> {
  return apiFetch<{ message: string; product: ApiProduct }>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

// ---------------------------------------------------------------------------
// Businesses
// ---------------------------------------------------------------------------

export interface BusinessFilters {
  isVerified?: boolean;
  isFeatured?: boolean;
  isRestaurant?: boolean;
  category?: string;
}

export interface CreateBusinessPayload {
  email: string;
  storeName: string;
  avatar?: string;
  phoneNumber?: string;
  isRestaurant?: boolean;
  description?: string;
  isVerified?: boolean;
}

export async function createBusiness(
  data: CreateBusinessPayload,
  token?: string,
): Promise<{ message: string; business: ApiBusiness }> {
  return apiFetch<{ message: string; business: ApiBusiness }>('/businesses', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function getBusinesses(filters?: BusinessFilters): Promise<ApiBusiness[]> {
  const query = buildQuery({ ...filters });
  return apiFetch<ApiBusiness[]>(`/businesses${query}`);
}

export async function getBusinessById(id: string): Promise<ApiBusiness> {
  if (!id) throw new Error('getBusinessById: id es requerido.');
  return apiFetch<ApiBusiness>(`/businesses/${id}`);
}

export async function getBusinessBySlug(slug: string): Promise<ApiBusiness> {
  if (!slug) throw new Error('getBusinessBySlug: slug es requerido.');
  return apiFetch<ApiBusiness>(`/businesses/slug/${slug}`);
}

// Lookup por email de contacto del negocio (no del usuario autenticado): úsalo
// solo cuando el email en sí es el dato conocido (p. ej. herramientas de
// admin). Para resolver "el negocio del usuario actual" usa getBusinessByOwnerId.
export async function getBusinessByEmail(email: string): Promise<ApiBusiness | null> {
  if (!email) return null;
  try {
    return await apiFetch<ApiBusiness>(`/businesses/email/${encodeURIComponent(email)}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('404')) return null;
    throw error;
  }
}

// Resuelve el negocio del usuario de Clerk autenticado vía Business.ownerUserId.
export async function getBusinessByOwnerId(userId: string): Promise<ApiBusiness | null> {
  if (!userId) return null;
  try {
    return await apiFetch<ApiBusiness>(`/businesses/owner/${encodeURIComponent(userId)}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('404')) return null;
    throw error;
  }
}

export async function getBusinessProducts(businessId: string): Promise<ApiProduct[]> {
  if (!businessId) throw new Error('getBusinessProducts: businessId es requerido.');
  return apiFetch<ApiProduct[]>(`/businesses/${businessId}/products`);
}

export async function updateBusiness(
  id: string,
  data: UpdateBusinessPayload,
  token?: string,
): Promise<ApiBusiness> {
  return apiFetch<ApiBusiness>(`/businesses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

export async function getFollowing(userId: string): Promise<ApiFollowing[]> {
  return apiFetch<ApiFollowing[]>(`/businesses/following?userId=${encodeURIComponent(userId)}`);
}

export async function toggleFollow(
  businessId: string,
  followerId: string,
  token?: string,
): Promise<{ isFollowing: boolean }> {
  return apiFetch<{ isFollowing: boolean }>(`/businesses/${businessId}/follow`, {
    method: 'POST',
    body: JSON.stringify({ followerId }),
    token,
  });
}

export async function checkIfFollowing(
  businessId: string,
  userId: string,
): Promise<{ isFollowing: boolean }> {
  return apiFetch<{ isFollowing: boolean }>(
    `/businesses/${businessId}/is-following?userId=${encodeURIComponent(userId)}`,
  );
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface CreateOrderPayload {
  buyerId: string;
  productId: string;
  businessId: string;
}

export interface CreateOrderResponse {
  message: string;
  order: ApiOrder;
}

export async function createOrder(
  payload: CreateOrderPayload,
  token?: string,
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}
