import { Zap, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
// 👇 CAMBIO 1: Importamos la función específica de ofertas
import { getPromotedProducts } from "@/lib/actions"; 
import { ProductCard } from "@/components/ProductCard";

// 👇 CAMBIO 2: Forzamos que la página se actualice siempre (para ver cambios al momento)
export const dynamic = "force-dynamic";

export default async function FlashDealsPage() {
  // 👇 CAMBIO 3: Usamos la función real. 
  // Ya no "simulamos" con slice(0,8), ahora trae SOLO los que tienen isPromoted: true
  const flashProducts = await getPromotedProducts();

  return (
    <div className="min-h-screen bg-orange-50/30 pb-20">
      
      {/* Header Temático (Tu diseño original conservado) */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-10 px-4 text-center text-white mb-8 relative shadow-lg">
        {/* Botón atrás mejorado para móvil */}
        <Link href="/" className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm">
            <ArrowLeft size={24} />
        </Link>
        
        <div className="inline-flex p-4 rounded-full bg-white/20 mb-4 backdrop-blur-sm animate-pulse ring-4 ring-white/10">
            <Zap size={48} className="fill-yellow-300 text-yellow-300" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 drop-shadow-sm">
          Ofertas Flash
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-orange-100 font-medium text-sm md:text-lg">
          <span>¡Precios bajos por tiempo limitado!</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider">
            Verificado
          </span>
        </div>
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
          // Estado vacío bonito
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Zap size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No hay ofertas activas ahora</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Nuestros vendedores están preparando los mejores precios. Vuelve en un rato para no perdértelos.
            </p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors">
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}