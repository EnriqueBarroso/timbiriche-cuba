"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories"; // 👈 Importamos

export function CategoriesBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeCategory = searchParams.get("category") || "all";

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSelectCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (id === "all") {
      params.delete("category");
    } else {
      params.set("category", id);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <section className="sticky top-16 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto max-w-7xl px-2 md:px-6 group">
        
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 hover:bg-gray-50 md:flex transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto py-3 md:py-3.5 md:px-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className={`
                  flex shrink-0 flex-col items-center gap-1.5 md:gap-2 rounded-xl px-3 py-3.5 md:px-4 md:py-2.5 text-center transition-all duration-200 min-w-[72px] md:min-w-[80px]
                  ${isActive 
                    ? "bg-gray-900 text-white shadow-md scale-105 font-semibold" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                  }
                `}
              >
                <Icon 
                  className={`
                    h-7 w-7 md:h-6 md:w-6
                    ${isActive ? "text-white" : "text-gray-500"}
                  `} 
                  strokeWidth={1.5} 
                />
                <span className="whitespace-nowrap text-xs font-medium">
                  <span className="md:hidden">{category.shortLabel}</span>
                  <span className="hidden md:inline">{category.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 hover:bg-gray-50 md:flex transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </section>
  );
}