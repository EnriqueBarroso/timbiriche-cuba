"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories"; // 👈 Importamos

interface CategoriesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesDrawer = ({ open, onOpenChange }: CategoriesDrawerProps) => {
  // Filtramos 'all' porque no tiene sentido expandirlo en un acordeón
  const displayCategories = CATEGORIES.filter(c => c.id !== 'all');

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
            {displayCategories.map((category) => {
              const Icon = category.icon;
              return (
                <AccordionItem key={category.id} value={category.id} className="border-b-0 mb-2">
                  <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{category.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-11 pb-2">
                      <Link
                        href={`/?category=${category.id}`}
                        onClick={() => onOpenChange(false)}
                        className="text-sm text-blue-600 font-semibold hover:underline py-2"
                      >
                        Ver todo en {category.shortLabel}
                      </Link>
                      
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/?search=${sub}&category=${category.id}`} 
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