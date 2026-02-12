// components/FlashProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";
import { formatPrice, BLUR_PLACEHOLDER } from "@/lib/utils";

interface FlashProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: { id: string; url: string }[];
  seller?: { storeName: string } | null;
}

export default function FlashProductCard({ product }: { product: FlashProduct }) {
  const imageUrl =
    product.images?.[0]?.url || "https://placehold.co/300x300?text=Sin+Imagen";

  return (
    <Link
      href={`/product/${product.id}`}
      className="min-w-[140px] max-w-[140px] lg:min-w-0 lg:max-w-none bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 snap-center hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={product.title}
          width={300}
          height={300}
          className="w-full h-[100px] lg:h-[140px] object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        {/* Badge de Oferta Flash */}
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] lg:text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" />
          Flash
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs lg:text-sm text-gray-700 font-medium truncate mb-1">
          {product.title}
        </p>
        <span className="text-red-600 font-bold text-sm lg:text-base">
          {formatPrice(product.price, product.currency)}
        </span>
        {product.seller?.storeName && (
          <p className="text-[10px] lg:text-xs text-gray-400 truncate mt-1">
            {product.seller.storeName}
          </p>
        )}
      </div>
    </Link>
  );
}