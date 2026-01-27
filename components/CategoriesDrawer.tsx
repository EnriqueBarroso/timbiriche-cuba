// components/CategoriesDrawer.tsx
"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { 
  Smartphone, Shirt, Home, UtensilsCrossed, Sparkles, 
  Car, Heart, Baby, Dumbbell, BookOpen
} from "lucide-react";

interface CategoriesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  {
    name: "Electrónica",
    slug: "electronica",
    icon: Smartphone,
    subcategories: ["Celulares", "Tablets", "Laptops", "Accesorios", "Audio"],
  },
  {
    name: "Moda",
    slug: "moda",
    icon: Shirt,
    subcategories: ["Ropa Mujer", "Ropa Hombre", "Zapatos", "Accesorios", "Joyería"],
  },
  {
    name: "Hogar",
    slug: "hogar",
    icon: Home,
    subcategories: ["Muebles", "Decoración", "Cocina", "Baño", "Jardín"],
  },
  {
    name: "Alimentos",
    slug: "alimentos",
    icon: UtensilsCrossed,
    subcategories: ["Bebidas", "Enlatados", "Snacks", "Carnes", "Lácteos"],
  },
  {
    name: "Belleza",
    slug: "belleza",
    icon: Sparkles,
    subcategories: ["Maquillaje", "Skincare", "Cabello", "Perfumes", "Uñas"],
  },
  // ... puedes añadir más categorías aquí
];

export default function CategoriesDrawer({ open, onOpenChange }: CategoriesDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold">Categorías</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <AccordionItem key={category.slug} value={category.slug} className="border-b border-gray-100">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{category.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pl-8 pb-2">
                      <Link
                        href={`/categoria/${category.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="text-sm text-blue-600 hover:underline py-1 font-medium"
                      >
                        Ver todo en {category.name}
                      </Link>
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/categoria/${category.slug}/${sub.toLowerCase().replace(/ /g, '-')}`}
                          onClick={() => onOpenChange(false)}
                          className="text-sm text-gray-500 hover:text-gray-900 py-1 transition-colors"
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