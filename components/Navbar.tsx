"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Heart,
  Store,
  Plus,
  User,
  Settings
} from "lucide-react";
import {
  SignedIn,
  UserButton
} from "@clerk/nextjs";
import { useFavorites } from "@/contexts/FavoritesContext";
import MobileMenu from "./MobileMenu"; 

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  
  const { favorites } = useFavorites();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        {/* IZQUIERDA: Menú Móvil + Logo */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <MobileMenu />
          </div>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:rotate-3 transition-transform">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 md:text-2xl">
              Timbi<span className="text-blue-600">riche</span>
            </span>
          </Link>
        </div>

        {/* CENTRO: Barra de Búsqueda (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="¿Qué buscas hoy?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* DERECHA: Iconos de Acción */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* 1. Botón Vender */}
          <Link 
            href="/vender" 
            className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" /> Vender
          </Link>
          <Link href="/vender" className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full">
            <Plus className="h-6 w-6" />
          </Link>

          {/* 2. Mis Publicaciones */}
          <SignedIn>
            <Link 
              href="/mis-publicaciones" 
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative group"
              title="Mis Publicaciones"
            >
              <Store className="h-6 w-6" />
            </Link>
          </SignedIn>

          {/* 3. Favoritos */}
          <Link href="/favoritos" className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors relative">
            <Heart className={`h-6 w-6 ${favorites.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
          </Link>

          {/* 4. Usuario / Login (CON MENÚ PERSONALIZADO) */}
          <div className="ml-1">
            <SignedIn>
              <UserButton afterSignOutUrl="/">
                {/* 👇 ESTO AÑADE TU PERFIL AL MENÚ DESPLEGABLE */}
                <UserButton.MenuItems>
                  <UserButton.Action 
                    label="Mi Perfil de Vendedor" 
                    labelIcon={<User className="w-4 h-4" />}
                    onClick={() => router.push('/perfil')} 
                  />
                  <UserButton.Action 
                    label="Configurar Cuenta" 
                    labelIcon={<Settings className="w-4 h-4" />}
                    onClick={() => router.push('/perfil')} 
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b" />}>
      <NavbarContent />
    </Suspense>
  );
}