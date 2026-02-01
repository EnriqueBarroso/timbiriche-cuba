// components/CategoriesDrawer.tsx
"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { 
  Utensils,     // Alimentos
  Car,          // Piezas
  Armchair,     // Hogar
  Bike,         // Mensajería
  Smartphone,   // Tecno
  Shirt         // Moda
} from "lucide-react";

interface CategoriesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Configuración alineada con tu estrategia
const categories = [
  {
    name: "Combos y Alimentos",
    slug: "food",
    icon: Utensils,
    subcategories: ["Combos Mixtos", "Cárnicos", "Agro", "Dulces"],
  },
  {
    name: "Piezas y Accesorios",
    slug: "parts",
    icon: Car,
    subcategories: ["Motos y Motorinas", "Autos", "Bicicletas", "Neumáticos"],
  },
  {
    name: "Hogar y Electro",
    slug: "home",
    icon: Armchair,
    subcategories: ["Electrodomésticos", "Muebles", "Cocina", "Climatización"],
  },
  {
    name: "Mensajería",
    slug: "logistics",
    icon: Bike,
    subcategories: ["Envíos Habana", "Interprovincial", "Mudanzas"],
  },
  {
    name: "Tecnología",
    slug: "tech",
    icon: Smartphone,
    subcategories: ["Celulares", "Laptops", "Accesorios", "Audio"],
  },
  {
    name: "Moda y Ropa",
    slug: "fashion",
    icon: Shirt,
    subcategories: ["Mujer", "Hombre", "Niños", "Zapatos"],
  },
];

export const CategoriesDrawer = ({ open, onOpenChange }: CategoriesDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            Timbi<span className="text-blue-600">riche</span> 🇨🇺
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-500 px-1">Explorar Categorías</p>
          
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <AccordionItem key={category.slug} value={category.slug} className="border-b-0 mb-2">
                  <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{category.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-11 pb-2">
                      <Link
                        href={`/?category=${category.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="text-sm text-blue-600 font-semibold hover:underline py-2"
                      >
                        Ver todo en {category.name}
                      </Link>
                      {/* Subcategorías solo como texto de búsqueda por ahora */}
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          // Buscamos por texto para que salga algo
                          href={`/?search=${sub}&category=${category.slug}`} 
                          onClick={() => onOpenChange(false)}
                          className="text-sm text-gray-500 hover:text-gray-900 py-2 hover:bg-gray-50 rounded px-2 -ml-2 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};