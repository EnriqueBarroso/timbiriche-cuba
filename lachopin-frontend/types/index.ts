// types/index.ts — plain TypeScript types (no Prisma dependency)

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface SellerBasic {
  id: string;
  storeName: string;
  slug: string | null;
  avatar: string | null;
  phoneNumber: string;
  email: string;
  isVerified: boolean;
  isRestaurant: boolean;
  isFeatured: boolean;
  rating: number;
  acceptsZelle: boolean;
  zelleEmail: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Product {
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
  createdAt: string | Date;
  updatedAt: string | Date;
  images: ProductImage[];
  seller: SellerBasic;
}
