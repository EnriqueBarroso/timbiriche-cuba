// types/index.ts
import { Prisma } from "@prisma/client";

// Definimos la imagen
export type ProductImage = {
  id: string;
  url: string;
  productId: string;
};

// 👇 AQUÍ ESTÁ EL CAMBIO CLAVE
// Añadimos "seller: true" para que TypeScript sepa que el producto tiene vendedor
export type Product = Prisma.ProductGetPayload<{
  include: { 
    images: true; 
    seller: true; 
  }
}>;