"use client";

import { useState, Suspense, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Heart, ShoppingBag, Plus, User, Settings, ArrowLeft, X, Building2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useFavorites } from "@/contexts/FavoritesContext";
import { formatPrice, optimizeImage } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SuggestionDropdown({ suggestions, onSelect }: { suggestions: any[]; onSelect: (id: string) => void }) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
      {suggestions.map((item) => (
        <button
          key={item.id}
          onMouseDown={() => onSelect(item.id)}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
        >
          {item.images[0]?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={optimizeImage(item.images[0].url, 80)}
              alt=""
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
            <p className="text-xs text-blue-600 font-bold">{formatPrice(item.price, item.currency)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const { favorites } = useFavorites();
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  // Autocompletado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const selectSuggestion = (productId: string) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery("");
    setIsMobileSearchOpen(false);
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    if (query.trim()) {
      router.push(`/?query=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false);
    } else {
      router.push("/");
    }
  };

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4">

        {/* ==============================================
            MODO BÚSQUEDA MÓVIL
           ============================================== */}
        {isMobileSearchOpen ? (
          <div className="relative flex w-full items-center gap-2 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={closeMobileSearch}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar en LaChopin..."
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-blue-100 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Sugerencias móvil */}
              {showSuggestions && (
                <SuggestionDropdown suggestions={suggestions} onSelect={selectSuggestion} />
              )}
            </form>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); handleSearch(e as unknown as React.FormEvent); }}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* ==============================================
             MODO NORMAL
             ============================================== */
          <>
            {/* IZQUIERDA: Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:rotate-3 transition-transform">
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
                ref={desktopInputRef}
                type="text"
                placeholder="¿Qué buscas hoy?"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Sugerencias desktop */}
              {showSuggestions && (
                <SuggestionDropdown suggestions={suggestions} onSelect={selectSuggestion} />
              )}
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

              {/* Botón Empresas MÓVIL */}
              <Link
                href="/mayoristas"
                className="md:hidden p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                aria-label="Empresas B2B"
              >
                <Building2 className="h-5 w-5" />
              </Link>

              {/* Elementos SOLO PC */}
              <div className="hidden md:flex items-center gap-3">
                {/* Botón Empresas PC */}
                <Link
                  href="/mayoristas"
                  className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-full text-sm font-bold hover:bg-amber-100 transition-colors shadow-sm active:scale-95"
                >
                  <Building2 className="h-4 w-4" /> Empresas
                </Link>

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
                      <UserButton.Action
                        label="Mi Perfil"
                        labelIcon={<User className="w-4 h-4" />}
                        onClick={() => router.push("/perfil")}
                      />
                      <UserButton.Action
                        label="Configurar Negocio"
                        labelIcon={<Settings className="w-4 h-4" />}
                        onClick={() => router.push("/vendedor/dashboard")}
                      />
                      <UserButton.Action
                        label="Ver mi Restaurante"
                        labelIcon={<Building2 className="w-4 h-4" />}
                        onClick={() => router.push("/eats")}
                      />
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