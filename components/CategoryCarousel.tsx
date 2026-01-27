"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Smartphone, Shirt, Home, UtensilsCrossed, 
  Car, Heart, Zap, LayoutGrid, Music
} from "lucide-react";

// (Mantén la lista de categories igual que la tienes, no hace falta cambiarla)
const categories = [
  { id: "all", name: "Todo", icon: LayoutGrid, bg: "bg-gray-100", text: "text-gray-700" },
  { id: "electronica", name: "Tecno", icon: Smartphone, bg: "bg-blue-100", text: "text-blue-600" },
  { id: "moda", name: "Moda", icon: Shirt, bg: "bg-pink-100", text: "text-pink-600" },
  { id: "hogar", name: "Hogar", icon: Home, bg: "bg-orange-100", text: "text-orange-600" },
  { id: "alimentos", name: "Comida", icon: UtensilsCrossed, bg: "bg-green-100", text: "text-green-600" },
  { id: "vehiculos", name: "Autos", icon: Car, bg: "bg-indigo-100", text: "text-indigo-600" },
  { id: "salud", name: "Salud", icon: Heart, bg: "bg-red-100", text: "text-red-600" },
  { id: "servicios", name: "Servicios", icon: Zap, bg: "bg-yellow-100", text: "text-yellow-700" },
  { id: "entretenimiento", name: "Ocio", icon: Music, bg: "bg-purple-100", text: "text-purple-600" },
];

export default function CategoryCarousel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleSelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    // CAMBIO 1: Aumentamos 'py-3' a 'py-5' para dar más altura al banner blanco
    <div className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all py-5">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* CAMBIO 2: 'md:gap-12' para separar bien los iconos en PC */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-2 md:justify-center md:gap-12 w-full">
          
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className="group flex flex-col items-center gap-3 min-w-[70px] flex-shrink-0 transition-all"
              >
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${cat.bg} ${cat.text}
                  ${isActive 
                    ? "ring-2 ring-offset-2 ring-gray-900 scale-110 font-bold shadow-md" 
                    : "hover:scale-105 hover:shadow-sm opacity-90 hover:opacity-100"
                  }
                `}>
                  <Icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`text-xs font-bold tracking-wide transition-colors ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-800"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}