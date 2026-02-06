"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Plus, Zap, User } from "lucide-react"; // 👇 Importamos Zap (Rayo)

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Ocultamos barra en pantallas de edición
  if (pathname?.startsWith("/editar")) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden pb-safe">
      <div className="grid h-full grid-cols-5 mx-auto">
        
        {/* 1. INICIO */}
        <Link
          href="/"
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${
            isActive("/") ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <Home className={`w-6 h-6 mb-1 ${isActive("/") ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>

        {/* 2. FAVORITOS */}
        <Link
          href="/favoritos"
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${
            isActive("/favoritos") ? "text-red-500" : "text-gray-500"
          }`}
        >
          <Heart className={`w-6 h-6 mb-1 ${isActive("/favoritos") ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Favoritos</span>
        </Link>

        {/* 3. VENDER (Botón Flotante Central) */}
        <div className="flex items-center justify-center relative">
            <Link
            href="/vender"
            className="absolute -top-5 flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 text-white hover:bg-blue-700 hover:scale-105 transition-all"
            >
            <Plus className="w-8 h-8" />
            </Link>
        </div>

        {/* 4. OFERTAS FLASH (Nuevo) */}
        {/* Asumo que la ruta será /ofertas, si es otra cámbiala aquí */}
        <Link
          href="/ofertas" 
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${
            isActive("/ofertas") ? "text-yellow-500" : "text-gray-500"
          }`}
        >
          {/* Usamos el icono Zap (Rayo) y si está activo se rellena de amarillo */}
          <Zap className={`w-6 h-6 mb-1 ${isActive("/ofertas") ? "fill-yellow-500 text-yellow-500" : ""}`} />
          <span className="text-[10px] font-medium">Ofertas</span>
        </Link>

        {/* 5. PERFIL */}
        <Link
          href="/perfil"
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${
            isActive("/perfil") ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <User className={`w-6 h-6 mb-1 ${isActive("/perfil") ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>

      </div>
    </div>
  );
}