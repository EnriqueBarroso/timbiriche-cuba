"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Car, Home, Smartphone, Shirt, Wrench, MoreHorizontal, LayoutGrid } from "lucide-react";

const categories = [
  { id: "all", label: "Todo", icon: LayoutGrid },
  { id: "vehiculos", label: "Autos", icon: Car },
  { id: "inmuebles", label: "Casas", icon: Home },
  { id: "electronica", label: "Tecno", icon: Smartphone },
  { id: "moda", label: "Moda", icon: Shirt },
  { id: "servicios", label: "Servicios", icon: Wrench },
  { id: "otros", label: "Otros", icon: MoreHorizontal },
];

export default function CategoryFilter() {
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
    <div className="w-full border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Contenedor Flex con Scroll Horizontal */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all flex-shrink-0
                  ${isActive 
                    ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}