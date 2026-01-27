// components/BottomNavigation.tsx
"use client"

import { Home, Compass, Grid3X3, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CategoriesDrawer from "./CategoriesDrawer";

// Mock del carrito
const useCart = () => ({ totalItems: 3 });

export default function BottomNavigation() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Compass, label: "Explorar", path: "/explorar" },
    { icon: Grid3X3, label: "Categorías", path: "#categories", isDrawer: true },
    { icon: ShoppingCart, label: "Carrito", path: "/carrito", badge: totalItems },
    { icon: User, label: "Cuenta", path: "/perfil" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden safe-area-bottom pb-1">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Verificar si es activo
            const active = !item.isDrawer && isActive(item.path);

            if (item.isDrawer) {
              return (
                <button
                  key={item.label}
                  onClick={() => setCategoriesOpen(true)}
                  className="flex flex-col items-center justify-center flex-1 py-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] font-medium mt-1">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                  active ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${active ? "fill-current" : ""}`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Reutilizamos el Drawer aquí también */}
      <CategoriesDrawer open={categoriesOpen} onOpenChange={setCategoriesOpen} />
    </>
  );
};