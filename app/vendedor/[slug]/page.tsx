import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Clock } from "lucide-react";

interface VendedorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VendedorProfilePage({ params }: VendedorPageProps) {
  const { slug } = await params;

  const seller = await prisma.seller.findUnique({
    where: { slug },
  });

  if (!seller) notFound();

  // 👇 SI ES RESTAURANTE: Mostramos la página de presentación bonita
  if (seller.isRestaurant) {
    return (
      <main className="min-h-screen bg-gray-100 font-sans flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-10">
          
          {/* 🎨 HEADER CON PORTADA */}
          <div className="relative h-64 w-full bg-gray-900">
            <img 
              src={seller.coverImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"} 
              alt="Portada" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
            
            {/* Botón Volver a /eats */}
            <div className="absolute top-4 left-4 z-10">
              <Link href="/eats" className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all border border-white/20">
                <ChevronLeft size={24} />
              </Link>
            </div>
          </div>

          {/* ℹ️ INFO DEL RESTAURANTE (Sube un poco sobre la imagen de portada) */}
          <div className="relative px-6 -mt-14 z-20">
            <div className="flex justify-between items-end mb-4">
              {/* Logo Redondo */}
              <div className="w-28 h-28 bg-white rounded-full p-1.5 shadow-xl border border-gray-100 relative">
                <img 
                  src={seller.profileImage || seller.logo || `https://ui-avatars.com/api/?name=${seller.storeName}&background=D32F2F&color=fff`} 
                  alt="Logo" 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
            </div>

            {/* Nombre */}
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
              {seller.storeName}
            </h1>
            
            {/* Etiquetas */}
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Abierto
              </span>
              <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <MapPin size={14} className="text-gray-400"/> La Habana
              </span>
            </div>

            {/* 🚀 BOTÓN GIGANTE PARA IR AL MENÚ */}
            <Link 
              href={`/vendedor/${slug}/menu`} 
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D32F2F] to-[#FF6B6B] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-red-500/30 hover:scale-[1.02] transition-all active:scale-95 mb-10"
            >
              <span className="text-2xl drop-shadow-sm">🍽️</span> Ver Menú y Pedir
            </Link>

            {/* 📋 DETALLES EXTRA (Teléfono, Horario) */}
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

  // 👇 SI NO ES RESTAURANTE, MUESTRA EL CATÁLOGO DE SIEMPRE
  return (
    <main>
       {/* ⚠️ NOTA: Aquí debe ir tu código original del catálogo general (donde muestras los zapatos, etc) */}
    </main>
  );
}