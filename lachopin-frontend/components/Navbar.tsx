"use client";

import { useState, Suspense, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Plus, User, Settings, X, Building2, Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useFavorites } from "@/contexts/FavoritesContext";
import { formatPrice, optimizeImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Tiendas", href: "/tiendas" },
  { label: "Empresas", href: "/mayoristas" },
  { label: "Soporte", href: "/ayuda" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SuggestionDropdown({ suggestions, onSelect }: { suggestions: any[]; onSelect: (id: string) => void }) {
  return (
    <div className="mt-2 bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
      {suggestions.map((item) => (
        <button
          key={item.id}
          onMouseDown={() => onSelect(item.id)}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted transition-colors text-left"
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
            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
            <p className="text-xs text-primary font-bold">{formatPrice(item.price, item.currency)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    onClose();
    router.push(`/product/${productId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?query=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
    onClose();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/60 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="mx-auto max-w-7xl px-4 py-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="w-full pl-14 pr-14 py-3 rounded-full bg-background text-base text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary shadow-lg"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {showSuggestions && (
          <SuggestionDropdown suggestions={suggestions} onSelect={selectSuggestion} />
        )}
      </div>
    </div>
  );
}

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { favorites } = useFavorites();

  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-4 max-w-7xl px-4 py-4">

        {/* IZQUIERDA: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transform group-hover:rotate-3 transition-transform">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight md:text-2xl text-foreground">
            La<span className="text-primary">Chopin</span>
          </span>
        </Link>

        {/* CENTRO: Links principales (SOLO PC) */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DERECHA: Acciones */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Búsqueda */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full transition-colors bg-card hover:bg-border text-foreground"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Elementos SOLO PC */}
          <div className="hidden md:flex items-center gap-4">
            {/* Favoritos */}
            <Link
              href="/favoritos"
              className="p-2 rounded-full transition-colors relative bg-card hover:bg-border"
              aria-label="Favoritos"
            >
              <Heart className={`h-5 w-5 ${favorites.length > 0 ? "fill-primary text-primary" : "text-foreground"}`} />
            </Link>

            {/* Vender (CTA) */}
            <Button asChild variant="default">
              <Link href="/vender">
                <Plus className="h-4 w-4" /> Vender
              </Link>
            </Button>
          </div>

          {/* Menú móvil (hamburguesa) */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-full transition-colors bg-card hover:bg-border text-foreground"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-1">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>

              {NAV_LINKS.map((link) => (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className="flex items-center px-3 py-3 rounded-2xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}

              <SheetClose asChild>
                <Link
                  href="/favoritos"
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Heart className={`h-5 w-5 ${favorites.length > 0 ? "fill-primary text-primary" : "text-muted-foreground"}`} /> Favoritos
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/vender"
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" /> Vender
                </Link>
              </SheetClose>

              <SignedOut>
                <SheetClose asChild>
                  <SignInButton mode="modal" forceRedirectUrl="/mis-publicaciones">
                    <Button variant="default" className="w-full mt-2">
                      <User className="h-4 w-4" /> Entrar
                    </Button>
                  </SignInButton>
                </SheetClose>
              </SignedOut>
            </SheetContent>
          </Sheet>

          {/* Usuario */}
          <SignedIn>
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Mi Perfil"
                  labelIcon={<User className="w-4 h-4" />}
                  onClick={() => router.push("/perfil")}
                />
                <UserButton.Action
                  label="Mi Tienda"
                  labelIcon={<ShoppingBag className="w-4 h-4" />}
                  onClick={() => router.push("/mis-publicaciones")}
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
              <Button variant="default" className="hidden md:inline-flex">
                <User className="h-4 w-4" /> Entrar
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-background border-b border-border" />}>
      <NavbarContent />
    </Suspense>
  );
}
