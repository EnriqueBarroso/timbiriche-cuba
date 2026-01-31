"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Smartphone, 
  Home, 
  Shirt, 
  Car, 
  Dumbbell, 
  Baby, 
  Palette, 
  Wrench,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutGrid
} from "lucide-react"

// Definimos las categorías con sus IDs (deben coincidir con tu DB o lógica de filtro)
const categories = [
  { id: "all", name: "Todo", icon: LayoutGrid },
  { id: "tech", name: "Tecnología", icon: Smartphone },
  { id: "home", name: "Hogar", icon: Home },
  { id: "fashion", name: "Moda", icon: Shirt },
  { id: "vehicles", name: "Vehículos", icon: Car },
  { id: "sports", name: "Deportes", icon: Dumbbell },
  { id: "kids", name: "Niños", icon: Baby },
  { id: "art", name: "Arte", icon: Palette },
  { id: "services", name: "Servicios", icon: Wrench },
]

export function CategoriesBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Obtenemos la categoría activa desde la URL. Si no hay, es "all"
  const activeCategory = searchParams.get("category") || "all"

  // Lógica de Scroll Horizontal
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Lógica de Selección de Categoría
  const handleSelectCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (id === "all") {
      params.delete("category") // "Todo" limpia el filtro
    } else {
      params.set("category", id) // Seteamos la categoría
    }
    
    // Opcional: Si cambias de categoría, resetea la búsqueda de texto para no confundir
    // params.delete("search") 
    
    params.delete("page") // Siempre volver a página 1 al filtrar
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="sticky top-16 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 group">
        
        {/* Botón Scroll Izquierda (Solo visible en Desktop) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 hover:bg-gray-50 md:flex transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        {/* Contenedor de Categorías (Scrollable) */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto py-3 md:px-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className={`
                  flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-4 py-2.5 text-center transition-all duration-200 min-w-[80px]
                  ${isActive 
                    ? "bg-gray-900 text-white shadow-sm scale-105 font-medium" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-gray-500"}`} strokeWidth={1.5} />
                <span className="whitespace-nowrap text-xs">
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Botón Scroll Derecha */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 hover:bg-gray-50 md:flex transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </section>
  )
}
