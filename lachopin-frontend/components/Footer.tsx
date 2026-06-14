"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook, Instagram, Twitter, ShoppingBag } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // 1. Detectamos si estamos en una página que necesita el footer resumido
  const isProductPage = pathname?.startsWith("/product/");

  // 👇 Detectamos si estamos en el perfil o menú de un restaurante/vendedor
  const isSellerPage = pathname?.startsWith("/vendedor/");

  // ------------------------------------------------------------------
  // 2. VERSIÓN MINIMALISTA (Para producto y para el restaurante)
  // ------------------------------------------------------------------
  if (isProductPage || isSellerPage) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 pt-6 pb-28 md:pb-6 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 px-4">

          {/* Si es restaurante, le damos el toque de LaChopin Eats */}
          {isSellerPage ? (
            <div className="text-center mb-2">
               <span className="text-2xl mb-1 opacity-40 grayscale block">🍔</span>
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                 Powered by <span className="text-[#D32F2F]">LaChopin Eats</span>
               </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              © {new Date().getFullYear()} LaChopin. Todos los derechos reservados.
            </p>
            <div className="flex justify-center gap-3 text-xs text-gray-400">
              <Link href="/seguridad" className="hover:text-gray-600">Seguridad</Link>
              <span>•</span>
              <Link href="/contacto" className="hover:text-gray-600">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // ------------------------------------------------------------------
  // 3. VERSIÓN COMPLETA (Newsletter + Footer)
  // ------------------------------------------------------------------
  return (
      <footer className="bg-card border-t border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

          {/* Grid: 1 columna en móvil, 2 en tablet, 4 en desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Columna 1: Marca */}
            <div>
              <Link href="/" className="flex items-center gap-2 group mb-4">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transform group-hover:rotate-3 transition-transform">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  La<span className="text-primary">Chopin</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6">
                Tu marketplace de confianza para encontrar productos de comerciantes locales en Cuba.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="bg-background rounded-full p-2 text-foreground hover:bg-primary hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="bg-background rounded-full p-2 text-foreground hover:bg-primary hover:text-white transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="bg-background rounded-full p-2 text-foreground hover:bg-primary hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Columna 2: Páginas */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Páginas
              </h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
                <Link href="/tiendas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tiendas</Link>
                <Link href="/ayuda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Soporte</Link>
              </div>
            </div>

            {/* Columna 3: Información */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Información
              </h3>
              <div className="flex flex-col gap-2">
                <Link href="/terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Términos y condiciones</Link>
                <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de privacidad</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de reembolso</Link>
              </div>
            </div>

            {/* Columna 4: Contacto */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Contacto
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="block text-muted-foreground">Email</span>
                  <a href="mailto:contacto@lachopin.com" className="text-foreground hover:text-primary transition-colors">
                    contacto@lachopin.com
                  </a>
                </div>
                <div>
                  <span className="block text-muted-foreground">WhatsApp</span>
                  <a href="https://wa.me/5350000000" className="text-foreground hover:text-primary transition-colors">
                    +53 5000 0000
                  </a>
                </div>
                <Link href="/mayoristas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Empresas
                </Link>
              </div>
            </div>

          </div>

          {/* Barra inferior */}
          <div className="pt-6 mt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} LaChopin. Todos los derechos reservados.
            </p>
            <div className="text-xs text-muted-foreground">
              Hecho con ❤️ para Cuba
            </div>
          </div>
        </div>
      </footer>
  );
}
