import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/actions"; // Reutilizamos tu acción
import { ProductCard } from "@/components/ProductCard";

export default async function FlashDealsPage() {
  // Truco: Buscamos productos que contengan "oferta" o traemos los más recientes
  // O idealmente, podrías filtrar por precio < X en el futuro.
  const products = await getProducts({ query: "" }); 
  // Simulamos ofertas tomando los primeros 4 productos (MVP)
  const flashProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-orange-50/30 pb-20">
      {/* Header Temático */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-12 px-4 text-center text-white mb-8">
        <Link href="/" className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft size={24} />
        </Link>
        <div className="inline-flex p-4 rounded-full bg-white/20 mb-4 backdrop-blur-sm animate-pulse">
            <Zap size={48} className="fill-yellow-300 text-yellow-300" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Ofertas Flash</h1>
        <p className="text-orange-100 font-medium text-lg">¡Precios bajos por tiempo limitado!</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {flashProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {flashProducts.map((product: any) => (
               <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No hay ofertas activas en este momento.
          </div>
        )}
      </div>
    </div>
  );
}