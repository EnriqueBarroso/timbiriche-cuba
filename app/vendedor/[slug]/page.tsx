import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Clock, BadgeCheck, ShoppingBag, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface VendedorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VendedorProfilePage({ params }: VendedorPageProps) {
  const { slug } = await params;

  // 👇 1. ACTUALIZAMOS LA CONSULTA PARA QUE TRAIGA LOS PRODUCTOS
  const seller = await prisma.seller.findUnique({
    where: { slug },
    include: {
      products: {
        where: { 
          isSold: false,
          type: 'MARKETPLACE' // Solo productos normales
        },
        orderBy: { createdAt: 'desc' },
        include: { images: true }
      },
      _count: {
        select: { followers: true, products: { where: { type: 'MARKETPLACE' } } }
      }
    }
  });

  if (!seller) notFound();

  // 🍔 ==========================================
  // SI ES RESTAURANTE: Interfaz de LaChopin Eats
  // ==========================================
  if (seller.isRestaurant) {
    return (
      <main className="min-h-screen bg-gray-100 font-sans flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-10">
          
          <div className="relative h-64 w-full bg-gray-900">
            <img 
              src={seller.coverImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"} 
              alt="Portada" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
            
            <div className="absolute top-4 left-4 z-10">
              <Link href="/eats" className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all border border-white/20">
                <ChevronLeft size={24} />
              </Link>
            </div>
          </div>

          <div className="relative px-6 -mt-14 z-20">
            <div className="flex justify-between items-end mb-4">
              <div className="w-28 h-28 bg-white rounded-full p-1.5 shadow-xl border border-gray-100 relative">
                <img 
                 src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=D32F2F&color=fff`}
                  alt="Logo" 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
              {seller.storeName}
            </h1>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Abierto
              </span>
              <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <MapPin size={14} className="text-gray-400"/> La Habana
              </span>
            </div>

            <Link 
              href={`/vendedor/${slug}/menu`} 
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D32F2F] to-[#FF6B6B] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-red-500/30 hover:scale-[1.02] transition-all active:scale-95 mb-10"
            >
              <span className="text-2xl drop-shadow-sm">🍽️</span> Ver Menú y Pedir
            </Link>

            <div className="space-y-5 bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="font-black text-gray-800 text-lg mb-2">Información del local</h3>
              
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp / Teléfono</p>
                  <p className="font-black text-gray-800">{seller.phoneNumber || "No disponible"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <Clock size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Horario Habitual</p>
                  <p className="font-black text-gray-800">10:00 AM - 11:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 🛍️ ==========================================
  // SI ES TIENDA NORMAL: Interfaz de Marketplace
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER DE LA TIENDA */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-8 pb-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0 bg-gray-100">
              <img 
                src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=random&color=fff`} 
                alt={`Logo de ${seller.storeName}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center md:justify-start gap-2 mb-2">
                {seller.storeName}
                {seller.isVerified && (
                  <BadgeCheck className="w-6 h-6 text-blue-500" title="Vendedor Verificado" />
                )}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" /> {seller._count.products} Productos
                </span>
                {seller.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {seller.phoneNumber}
                  </span>
                )}
              </div>

              {seller.acceptsZelle && (
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold">
                  Acepta Zelle
                </span>
              )}
            </div>
            
            <div className="w-full md:w-auto mt-4 md:mt-0">
               <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
                 Seguir Tienda
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATÁLOGO DE PRODUCTOS DE LA TIENDA */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Catálogo de {seller.storeName}</h2>
        
        {seller.products.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-lg">Esta tienda aún no tiene productos a la venta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {seller.products.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                  )}
                </div>
                
                <div className="p-3 md:p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="mt-auto pt-2">
                    <p className="font-bold text-lg text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}