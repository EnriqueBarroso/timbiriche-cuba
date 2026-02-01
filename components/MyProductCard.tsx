"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export default function MyProductCard({ product }: Props) {
  // Aseguramos datos para que no falle
  const title = product.title || "Producto sin nombre";
  const price = product.price || 0;
  
  // CORRECCIÓN AQUÍ: Usamos placehold.co si no hay imagen
  const imageRaw = product.images?.[0]?.url;
  const image = (imageRaw && imageRaw.startsWith('http')) 
    ? imageRaw 
    : "https://placehold.co/600x400/png?text=Sin+Foto"; // 👈 URL segura

  const date = new Date(product.createdAt).toLocaleDateString();

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <article className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        
        {/* Imagen */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Badge de estado */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium">
            Activo
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1" title={title}>
            {title}
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Publicado el {date}
          </p>
          
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${(price / 100).toFixed(2)}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              Ver ficha
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}