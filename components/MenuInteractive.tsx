"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 Importamos el router
import { ChevronLeft, Info } from "lucide-react";
import MenuItemCard from "@/components/MenuItemCard";
import FloatingCartBar from "@/components/FloatingCartBar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MenuInteractive({ seller, groupedProducts, categories, slug }: any) {
  // 👇 INICIALIZAMOS EL ROUTER AQUÍ
  const router = useRouter(); 

  // Estado para controlar qué pestaña está activa (por defecto la primera)
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");

  // Solo extraemos los platos de la categoría seleccionada
  const activeProducts = groupedProducts[activeCategory] || [];
  const phoneNumber = seller.phoneNumber || "";

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative pb-32 shadow-2xl overflow-hidden">
        
        {/* 🎨 HEADER CON IMAGEN DE PORTADA (Estilo Uber Eats) */}
        <header className="relative pt-4 pb-8 px-4 text-white rounded-b-[2.5rem] shadow-lg z-10 overflow-hidden">
          
          {/* Fondo de Portada y Efecto de Oscurecido */}
          <div className="absolute inset-0 z-0 bg-gray-900">
            <img 
              // Si el restaurante no ha subido portada, le ponemos una de comida genérica hermosa
              src={seller.coverImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"} 
              alt="Portada del restaurante" 
              className="w-full h-full object-cover opacity-70"
            />
            {/* Gradiente oscuro de abajo hacia arriba para que el nombre resalte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20"></div>
          </div>

          {/* Botones de Navegación (Flotando sobre la imagen) */}
          <div className="relative z-10 flex items-center justify-between mb-2">
            <button 
              onClick={() => router.back()} // 👈 AHORA SÍ FUNCIONA EL BOTÓN ATRÁS
              className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all active:scale-95 border border-white/20"
            >
              <ChevronLeft size={24} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all active:scale-95 border border-white/20">
              <Info size={20} />
            </button>
          </div>
          
          {/* Info del Restaurante centrada */}
          <div className="relative z-10 flex flex-col items-center px-4 mt-2">
            
            {/* Logo Circular del Restaurante */}
            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-2xl mb-3 border border-gray-100 relative">
               <img 
                 src={seller.profileImage || seller.logo || `https://ui-avatars.com/api/?name=${seller.storeName}&background=D32F2F&color=fff`} 
                 alt="Logo" 
                 className="w-full h-full rounded-full object-cover" 
               />
            </div>

            <h1 className="text-3xl font-black tracking-tight mb-2 drop-shadow-lg text-center leading-none">
              {seller.storeName || "Menú"}
            </h1>
            
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-50 text-[11px] font-black px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm uppercase tracking-widest mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
              Abierto ahora
            </span>
          </div>
        </header>

        {/* 👆 PESTAÑAS STICKY (Navegación limpia) */}
        {categories.length > 0 && (
          <div className="sticky top-0 z-40 bg-gray-50/90 backdrop-blur-xl pt-5 pb-3 shadow-sm border-b border-gray-200/50">
            <div className="flex overflow-x-auto items-center gap-2.5 px-4 scroll-smooth [&::-webkit-scrollbar]:hidden">
              {categories.map((category: string) => (
                <button 
                  key={category} 
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-5 py-2.5 text-[13px] font-black rounded-full transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-[#D32F2F] text-white shadow-md shadow-red-500/30 scale-105" // Pestaña Activa
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 active:scale-95" // Inactiva
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🍔 CONTENIDO: SOLO LA CATEGORÍA ACTIVA */}
        <section className="px-4 py-6">
          {categories.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Título de la sección */}
              <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                {activeCategory}
                <span className="text-[11px] font-bold text-[#D32F2F] bg-red-100 px-2 py-0.5 rounded-full">
                  {activeProducts.length}
                </span>
              </h2>

              {/* Contenedor tipo "Tarjeta" para todos los platos de esta sección */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {activeProducts.map((product: any) => (
                  <MenuItemCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.title,
                      description: product.description,
                      price: product.price,
                      sellerId: seller.id,
                      image: product.images[0]?.url 
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Estado Vacío Bonito */
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 mt-6 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🍽️</span>
              </div>
              <p className="font-bold text-gray-800">Menú en preparación</p>
              <p className="text-xs text-gray-400 mt-1">Vuelve pronto para ver nuestras delicias.</p>
            </div>
          )}
        </section>

        {/* Carrito Flotante */}
        <FloatingCartBar 
          sellerName={seller.storeName || "Restaurante"} 
          sellerPhoneNumber={phoneNumber} 
        />
      </div>
    </main>
  );
}