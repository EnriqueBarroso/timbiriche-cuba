"use client";

// 1. Añade Suspense a los imports
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Heart, 
  Store, 
  User, 
  Menu, 
  X, 
  ShoppingBag, 
  ShoppingCart,
  Package 
} from "lucide-react";
import { 
  SignInButton, 
  SignedIn, 
  SignedOut, 
  UserButton 
} from "@clerk/nextjs";
import { useCart } from "@/contexts/CartContext";

// 2. Cambia el nombre de tu función actual a "NavbarContent"
// (MANTÉN TODO EL CÓDIGO INTERNO IGUAL, solo cambia el nombre aquí)
function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 El culpable del error
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { cartCount } = useCart(); 
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
      setIsMobileMenuOpen(false);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* LOGO & MENU */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 text-white p-1.5 rounded-lg group-hover:rotate-3 transition-transform shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="hidden sm:block text-xl font-extrabold tracking-tight text-gray-900">
              Timbi<span className="text-blue-600">riche</span> 🇨🇺
            </span>
            <span className="sm:hidden text-lg font-extrabold tracking-tight text-gray-900">
              Timbi<span className="text-blue-600">riche</span>
            </span>
          </Link>
        </div>

        {/* BUSCADOR DESKTOP */}
        <div className="hidden flex-1 px-8 md:flex md:max-w-xl">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              placeholder="Buscar en Cuba..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-12 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <button 
              type="submit"
              className="absolute right-1.5 top-1.5 rounded-full bg-blue-600 p-1.5 text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex items-center gap-1 md:gap-2">
          
          <Link href="/vender"> 
            <button className="hidden md:flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <Store className="h-4.5 w-4.5" />
              <span>Vender</span>
            </button>
          </Link>

          {/* BOTÓN "MIS PUBLICACIONES" */}
          <SignedIn>
            <Link href="/mis-publicaciones">
              <button 
                className="hidden md:flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                title="Gestionar mis productos"
              >
                <Package className="h-4.5 w-4.5" />
                <span>Mis cosas</span>
              </button>
            </Link>
          </SignedIn>

          {/* CARRITO */}
          <Link href="/carrito">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative group">
              <ShoppingCart className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* FAVORITOS */}
          <Link href="/favoritos">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative group">
              <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
            </button>
          </Link>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>

          <div className="ml-1">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-gray-100 hover:ring-blue-500 transition-all"
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex h-9 items-center gap-2 rounded-full bg-gray-900 px-4 text-sm font-medium text-white shadow hover:bg-gray-800 transition-all hover:scale-105">
                  <User className="h-4 w-4" />
                  <span>Ingresar</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>
      </div>

      {/* MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </form>

          <div className="flex flex-col gap-2">
            <Link 
              href="/vender" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-900 font-medium"
            >
              <Store className="h-5 w-5" /> Vender Producto
            </Link>
            
            <SignedIn>
              <Link 
                href="/mis-publicaciones" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium"
              >
                <Package className="h-5 w-5" /> Mis Publicaciones
              </Link>
            </SignedIn>

            <Link 
              href="/favoritos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium"
            >
              <Heart className="h-5 w-5" /> Mis Favoritos
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}

// 3. Crea esta nueva función "Navbar" que envuelve a la anterior
export function Navbar() {
  return (
    // Fallback simple: una caja blanca de 16px de alto para que no salte el diseño mientras carga
    <Suspense fallback={<div className="h-16 w-full bg-white/80 border-b border-gray-100" />}>
      <NavbarContent />
    </Suspense>
  );
}
