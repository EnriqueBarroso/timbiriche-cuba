"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronRight, ChevronDown, ChevronUp, Store, Package, MapPin, Users } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { ApiSeller } from "@/lib/api";

interface SellerProductsRowProps {
  seller: ApiSeller;
}

const MAX_VISIBLE = 5;

export function SellerProductsRow({ seller }: SellerProductsRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedProducts = [...seller.products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const extraCount = sortedProducts.length - MAX_VISIBLE;
  const hasMore = extraCount > 0;
  const visibleProducts = isExpanded ? sortedProducts : sortedProducts.slice(0, MAX_VISIBLE);

  if (sortedProducts.length === 0) return null;

  return (
    <div className="mb-0">

      {/* ── Header de la tienda ──────────────────────────── */}
      <div className="px-4 mb-3 flex items-center justify-between gap-3">
        <Link
          href={`/vendedor/${seller.slug}`}
          className="flex items-center gap-3 group min-w-0"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-50 border-2 border-white shadow shrink-0 group-hover:scale-105 transition-transform">
            {seller.avatar ? (
              <Image
                src={seller.avatar}
                alt={seller.storeName}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <Store size={18} className="text-blue-600" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-gray-900 text-[15px] leading-none group-hover:text-blue-600 transition-colors truncate">
                {seller.storeName}
              </h3>
              {seller.isVerified && (
                <BadgeCheck size={15} className="text-blue-500 shrink-0" />
              )}
              {seller.isRestaurant && (
                <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100 shrink-0 leading-none">
                  Restaurante
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                <Package size={10} />
                {seller._count.products} {seller._count.products === 1 ? "producto" : "productos"}
              </span>
              {seller._count.followers > 0 && (
                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                  <Users size={10} />
                  {seller._count.followers} {seller._count.followers === 1 ? "seguidor" : "seguidores"}
                </span>
              )}
              {seller.address && (
                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium truncate max-w-[120px]">
                  <MapPin size={10} className="shrink-0" />
                  {seller.address.split(",")[0]}
                </span>
              )}
            </div>
          </div>
        </Link>

        <Link
          href={`/vendedor/${seller.slug}`}
          className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-100 transition-colors"
        >
          Ver tienda <ChevronRight size={11} />
        </Link>
      </div>

      {/* ── Carrusel de productos ─────────────────────────── */}
      <div className="flex overflow-x-auto gap-3 px-4 pb-3 no-scrollbar snap-x">
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className={`min-w-[148px] w-[148px] sm:min-w-[168px] sm:w-[168px] snap-start shrink-0 ${
              isExpanded && index >= MAX_VISIBLE
                ? "animate-in fade-in slide-in-from-bottom-2 duration-300"
                : ""
            }`}
          >
            <ProductCard product={{ ...product, seller }} compact />
          </div>
        ))}
      </div>

      {/* ── Botón Ver más / Ver menos ─────────────────────── */}
      {hasMore && (
        <div className="px-4 mt-2 flex justify-end">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-1.5 rounded-full transition-colors active:scale-95"
          >
            {isExpanded ? (
              <>Ver menos <ChevronUp size={12} /></>
            ) : (
              <>Ver más ({extraCount}) <ChevronDown size={12} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
