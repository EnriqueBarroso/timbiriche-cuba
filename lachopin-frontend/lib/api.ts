// ---------------------------------------------------------------------------
// Plain TypeScript types — mirrors what the NestJS API returns
// ---------------------------------------------------------------------------

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface SellerInProduct {
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
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  seller: SellerInProduct;
}

export interface ProductInSeller {
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

export interface ApiSeller {
  id: string;
  storeName: string;
  slug: string | null;
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
  createdAt: string;
  products: ProductInSeller[];
  _count: {
    followers: number;
    products: number;
  };
}

export interface ApiFollowing {
  followerId: string;
  sellerId: string;
  seller: {
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
  sellerId: string;
  product: { id: string; title: string; price: number; currency: string };
  seller: { id: string; storeName: string; slug: string | null; avatar: string | null };
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

export interface UpdateSellerPayload {
  storeName?: string;
  phoneNumber?: string;
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
    description: string;
    price: number;
    currency?: string;
    category: string;
    sellerId: string;
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
// Sellers
// ---------------------------------------------------------------------------

export interface SellerFilters {
  isVerified?: boolean;
  isFeatured?: boolean;
  isRestaurant?: boolean;
}

export interface CreateSellerPayload {
  email: string;
  storeName: string;
  avatar?: string;
  phoneNumber?: string;
  isRestaurant?: boolean;
}

export async function createSeller(
  data: CreateSellerPayload,
  token?: string,
): Promise<{ message: string; seller: ApiSeller }> {
  return apiFetch<{ message: string; seller: ApiSeller }>('/sellers', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function getSellers(filters?: SellerFilters): Promise<ApiSeller[]> {
  const query = buildQuery({ ...filters });
  return apiFetch<ApiSeller[]>(`/sellers${query}`);
}

export async function getSellerById(id: string): Promise<ApiSeller> {
  if (!id) throw new Error('getSellerById: id es requerido.');
  return apiFetch<ApiSeller>(`/sellers/${id}`);
}

export async function getSellerBySlug(slug: string): Promise<ApiSeller> {
  if (!slug) throw new Error('getSellerBySlug: slug es requerido.');
  return apiFetch<ApiSeller>(`/sellers/slug/${slug}`);
}

export async function getSellerByEmail(email: string): Promise<ApiSeller | null> {
  if (!email) return null;
  try {
    return await apiFetch<ApiSeller>(`/sellers/email/${encodeURIComponent(email)}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('404')) return null;
    throw error;
  }
}

export async function getSellerProducts(sellerId: string): Promise<ApiProduct[]> {
  if (!sellerId) throw new Error('getSellerProducts: sellerId es requerido.');
  return apiFetch<ApiProduct[]>(`/sellers/${sellerId}/products`);
}

export async function updateSeller(
  id: string,
  data: UpdateSellerPayload,
  token?: string,
): Promise<ApiSeller> {
  return apiFetch<ApiSeller>(`/sellers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

export async function getFollowing(userId: string): Promise<ApiFollowing[]> {
  return apiFetch<ApiFollowing[]>(`/sellers/following?userId=${encodeURIComponent(userId)}`);
}

export async function toggleFollow(
  sellerId: string,
  followerId: string,
  token?: string,
): Promise<{ isFollowing: boolean }> {
  return apiFetch<{ isFollowing: boolean }>(`/sellers/${sellerId}/follow`, {
    method: 'POST',
    body: JSON.stringify({ followerId }),
    token,
  });
}

export async function checkIfFollowing(
  sellerId: string,
  userId: string,
): Promise<{ isFollowing: boolean }> {
  return apiFetch<{ isFollowing: boolean }>(
    `/sellers/${sellerId}/is-following?userId=${encodeURIComponent(userId)}`,
  );
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface CreateOrderPayload {
  buyerId: string;
  productId: string;
  sellerId: string;
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
