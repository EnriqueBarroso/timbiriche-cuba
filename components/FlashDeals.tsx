// components/FlashDeals.tsx
import { Zap } from "lucide-react";
import { getPromotedProducts } from "@/lib/actions";
import FlashProductCard from "./FlashProductCard";

export default async function FlashDeals() {
  const products = await getPromotedProducts();

  // Si no hay productos promocionados, no mostramos la sección
  if (!products || products.length === 0) return null;

  return (
    <section className="px-4 lg:px-8 py-6 bg-gradient-to-r from-red-50 to-white mb-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-red-600">
            <Zap className="w-5 h-5 fill-red-600" />
            <span className="font-bold text-lg uppercase tracking-tight">
              Ofertas Flash
            </span>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            {products.length} {products.length === 1 ? "producto" : "productos"} destacados
          </span>
        </div>
      </div>

      {/* Grid Horizontal Deslizable */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-4 lg:mx-0 lg:px-0 lg:overflow-visible snap-x">
        {products.map((product) => (
          <FlashProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}