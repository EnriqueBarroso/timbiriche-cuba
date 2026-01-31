// app/vendedor/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { BadgeCheck, MapPin, Calendar, Star, MessageCircle, Store } from "lucide-react";
import { Product } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SellerPage({ params }: Props) {
  const { id } = await params;

  // 1. Buscamos al vendedor y sus productos ACTIVOS
  const seller = await prisma.seller.findUnique({
    where: { id },
    include: {
      products: {
        where: { isActive: true }, // Solo productos visibles
        include: { images: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!seller) return notFound();

  // Datos visuales
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName || 'Vendedor')}&background=random&size=200`;
  const cleanPhone = seller.phoneNumber?.replace(/\D/g, '') || '';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${seller.storeName}, vi tu tienda en Timbiriche y quisiera consultar algo.`)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- PORTADA Y PERFIL --- */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={avatarUrl} 
                alt={seller.storeName || "Tienda"} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {seller.isVerified && (
                <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white" title="Tienda Verificada">
                  <BadgeCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Info Texto */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {seller.storeName || "Usuario de Timbiriche"}
              </h1>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900">4.9</span> 
                  <span>(15 ventas)</span>
                </div>
                <div className="flex items-center gap-1">
                   <MapPin className="w-4 h-4" /> La Habana
                </div>
                <div className="flex items-center gap-1">
                   <Calendar className="w-4 h-4" /> En Timbiriche desde 2024
                </div>
              </div>

              {/* Botón de Contacto General */}
              {seller.phoneNumber && (
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat con la Tienda
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- CATÁLOGO DE PRODUCTOS --- */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Store className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Catálogo Disponible ({seller.products.length})</h2>
        </div>

        {seller.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {seller.products.map((product) => (
              // Usamos el 'Double Casting' para evitar errores de tipos
              <ProductCard key={product.id} product={product as unknown as Product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">Esta tienda no tiene productos activos por ahora.</p>
          </div>
        )}
      </div>

    </div>
  );
}