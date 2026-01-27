// components/FlashProductCard.tsx
import React from 'react';

// Definimos la interfaz solo para este componente visual
interface FlashProduct {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
}

export default function FlashProductCard({ product }: { product: FlashProduct }) {
  return (
    <div className="min-w-[140px] max-w-[140px] lg:min-w-0 lg:max-w-none bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 snap-center">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[100px] lg:h-[140px] object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] lg:text-xs font-bold px-2 py-0.5 rounded">
          -{product.discount}%
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs lg:text-sm text-gray-700 font-medium truncate mb-1">
          {product.title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-red-600 font-bold text-sm lg:text-base">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-gray-400 text-[10px] lg:text-xs line-through decoration-gray-400">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};