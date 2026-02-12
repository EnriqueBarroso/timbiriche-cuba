"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Heart, ShoppingBag, Plus, User, Settings, ArrowLeft, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useFavorites } from "@/contexts/FavoritesContext";

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estado para el input (query) y para la visibilidad del buscador móvil
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const { favorites } = useFavorites();
  const inputRef = useRef<HTMLInputElement>(null);

  // Efecto para enfocar el input automáticamente cuando se abre el buscador móvil
  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?query=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false); 
    } else {
      router.push("/");
    }
  };

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
    setQuery(""); 
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4">
        
        {/* ==============================================
            MODO BÚSQUEDA MÓVIL
           ============================================== */}
        {isMobileSearchOpen ? (
          <form 
            onSubmit={handleSearch} 
            className="flex w-full items-center gap-2 md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <button 
              type="button" 
              onClick={closeMobileSearch}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar en LaChopin..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-blue-100 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <button 
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* ==============================================
             MODO NORMAL
             ============================================== */
          <>
            {/* IZQUIERDA: Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:rotate-3 transition-transform">
                  {/* Icono actualizado a Bolsa de Compras */}
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-gray-900 md:text-2xl">
                  La<span className="text-blue-600">Chopin</span>
                </span>
              </Link>
            </div>

            {/* CENTRO: Barra de Búsqueda (SOLO PC) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex relative flex-1 max-w-md mx-4"
            >
              <input
                type="text"
                placeholder="¿Qué buscas hoy?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* DERECHA: Iconos */}
            <div className="flex items-center gap-1 md:gap-3">
              
              {/* Botón búsqueda móvil */}
              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Elementos SOLO PC */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/vender"
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Vender
                </Link>
                
                <Link
                  href="/favoritos"
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors relative"
                >
                  <Heart className={`h-6 w-6 ${favorites.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                </Link>
              </div>

              {/* MI TIENDA */}
              <SignedIn>
                <Link
                  href="/mis-publicaciones"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative group"
                  title="Mi Tienda"
                >
                  <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
                </Link>
              </SignedIn>

              {/* Usuario */}
              <div className="ml-1">
                <SignedIn>
                  <UserButton afterSignOutUrl="/">
                    <UserButton.MenuItems>
                      <UserButton.Action label="Mi Perfil" labelIcon={<User className="w-4 h-4" />} onClick={() => router.push("/perfil")} />
                      <UserButton.Action label="Configurar Cuenta" labelIcon={<Settings className="w-4 h-4" />} onClick={() => router.push("/perfil")} />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal" forceRedirectUrl="/mis-publicaciones">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                      <User className="h-4 w-4" /> <span className="hidden md:inline">Entrar</span>
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>

            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-14 bg-white border-b" />}>
      <NavbarContent />
    </Suspense>
  );
}