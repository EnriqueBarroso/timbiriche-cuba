"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Plus, Zap, User } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  const isActive = (path: string) => pathname === path;

  // Ocultar barra en rutas de edición o administración para ganar espacio
  if (pathname?.startsWith("/editar") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden pb-safe">
      <div className="grid h-full grid-cols-5 mx-auto max-w-md">
        
        {/* 1. INICIO */}
        <Link
          href="/"
          aria-label="Ir al inicio"
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${
            isActive("/") ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <Home className={`w-6 h-6 mb-1 ${isActive("/") ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>

        {/* 2. FAVORITOS (Con Badge) */}
        <Link
          href="/favoritos"
          aria-label="Ver mis favoritos"
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group relative ${
            isActive("/favoritos") ? "text-red-500" : "text-gray-500"
          }`}
        >
          <div className="relative">
            <Heart 
              className={`w-6 h-6 mb-1 transition-transform active:scale-90 ${
                isActive("/favoritos") || favorites.length > 0 ? "fill-current" : ""
              }`} 
            />
            
            {/* Badge Rojo */}
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white border-2 border-white animate-in zoom-in">
                {favorites.length > 9 ? "+9" : favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Favoritos</span>
        </Link>

        {/* 3. VENDER (Botón Flotante Central) */}
        <div className="flex items-center justify-center relative">
            <Link
              href="/vender"
              aria-label="Publicar nuevo anuncio"
              className="absolute -top-6 flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 text-white hover:bg-blue-700 active:scale-95 transition-all border-4 border-gray-50"
            >
              <Plus className="w-8 h-8" />
            </Link>
            {/* Texto invisible para mantener el grid alineado, o visible si prefieres */}
            <span className="text-[10px] font-medium mt-8 text-blue-600 opacity-0">Vender</span>
        </div>

        {/* 4. OFERTAS */}
        <Link
          href="/ofertas"
          aria-label="Ver ofertas" 
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${
            isActive("/ofertas") ? "text-yellow-500" : "text-gray-500"
          }`}
        >
          <Zap className={`w-6 h-6 mb-1 ${isActive("/ofertas") ? "fill-yellow-500 text-yellow-500" : ""}`} />
          <span className="text-[10px] font-medium">Ofertas</span>
        </Link>

        {/* 5. PERFIL */}
        <Link
          href="/perfil"
          aria-label="Mi perfil"
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