import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Store, BadgeCheck, ShoppingBag, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Directorio de Tiendas | LaChopin",
  description: "Descubre todas las tiendas y vendedores verificados en LaChopin.",
};

export default async function TiendasPage() {
  // Obtenemos todos los vendedores que NO sean restaurantes y que tengan productos
  const sellers = await prisma.seller.findMany({
    where: {
      isRestaurant: false,
      products: {
        some: { type: 'MARKETPLACE' }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: { products: { where: { type: 'MARKETPLACE' } } }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER BÁSICO */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-8 pb-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" /> Directorio de Tiendas
          </h1>
          <p className="text-gray-500 mt-2">Explora todos los negocios y emprendedores que venden en LaChopin.</p>
        </div>
      </div>

      {/* CUADRÍCULA DE TIENDAS */}
      <div className="max-w-7xl mx-auto px-4">
        {sellers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 text-lg">Aún no hay tiendas disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sellers.map((seller) => (
              <Link 
                key={seller.id} 
                href={`/vendedor/${seller.slug}`} 
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                   <img 
                     src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=random&color=fff`} 
                     alt={seller.storeName} 
                     className="w-full h-full object-cover" 
                   />
                </div>
                
                <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors flex items-center justify-center gap-1 w-full">
                  <span className="truncate">{seller.storeName}</span>
                  {seller.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                </h2>
                
                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1 bg-gray-50 px-3 py-1 rounded-full w-fit">
                  <ShoppingBag className="w-4 h-4" /> 
                  {seller._count.products} {seller._count.products === 1 ? 'Producto' : 'Productos'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}