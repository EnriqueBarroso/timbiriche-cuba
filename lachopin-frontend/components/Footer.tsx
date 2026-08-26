"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook, Instagram, Twitter, ShoppingBag } from "lucide-react";
import { getBusinessBySlug } from "@/lib/api";

// Pendiente: rellenar con las URLs reales de las redes sociales.
const SOCIAL_LINKS = {
  facebook: "",
  twitter: "",
  instagram: "",
};

function SocialIcons({ compact = false }: { compact?: boolean }) {
  const size = compact ? 20 : 18;
  const className = compact
    ? "hover:text-blue-600 transition-colors"
    : "bg-background rounded-full p-2 text-foreground hover:bg-primary hover:text-white transition-colors";

  return (
    <div className={compact ? "flex items-center gap-4 text-gray-400" : "flex items-center gap-3"}>
      <a href={SOCIAL_LINKS.facebook} className={compact ? className : className} aria-label="Facebook">
        <Facebook size={size} />
      </a>
      <a
        href={SOCIAL_LINKS.twitter}
        className={compact ? "hover:text-blue-400 transition-colors" : className}
        aria-label="X (Twitter)"
      >
        <Twitter size={size} />
      </a>
      <a
        href={SOCIAL_LINKS.instagram}
        className={compact ? "hover:text-pink-600 transition-colors" : className}
        aria-label="Instagram"
      >
        <Instagram size={size} />
      </a>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // 1. La versión completa (4 columnas) solo aplica al home; cualquier
  // otra página usa el footer resumido.
  const isHomePage = pathname === "/";

  // 👇 Detectamos si estamos en el perfil o menú de un restaurante/vendedor
  const isBusinessPage = pathname?.startsWith("/vendedor/");
  const businessSlug = isBusinessPage ? pathname?.split("/")[2] : null;

  // El badge "LaChopin Eats" solo aplica a negocios de tipo restaurante —
  // Business.isRestaurant, mismo campo que ya usa el resto del proyecto
  // (BusinessStorefront.tsx, /perfil, etc.) para distinguir el tipo de negocio.
  const [isRestaurant, setIsRestaurant] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkBusinessType() {
      if (!businessSlug) {
        if (!cancelled) setIsRestaurant(false);
        return;
      }
      try {
        const business = await getBusinessBySlug(businessSlug);
        if (!cancelled) setIsRestaurant(!!business.isRestaurant);
      } catch {
        if (!cancelled) setIsRestaurant(false);
      }
    }

    checkBusinessType();
    return () => {
      cancelled = true;
    };
  }, [businessSlug]);

  // ------------------------------------------------------------------
  // 2. VERSIÓN MINIMALISTA (cualquier página que no sea el home)
  // ------------------------------------------------------------------
  if (!isHomePage) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 pt-6 pb-28 md:pb-6 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 px-4">

          {/* Solo negocios de tipo restaurante llevan el toque de LaChopin Eats */}
          {isBusinessPage && isRestaurant ? (
            <div className="text-center mb-2">
               <span className="text-2xl mb-1 opacity-40 grayscale block">🍔</span>
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                 Powered by <span className="text-[#D32F2F]">LaChopin Eats</span>
               </p>
            </div>
          ) : (
            <SocialIcons compact />
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
  // 3. VERSIÓN COMPLETA (solo home)
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
                La plataforma de negocios cubanos: tiendas y restaurantes con pedidos
                directos por WhatsApp.
              </p>
              <SocialIcons />
            </div>

            {/* Columna 2: Páginas */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Páginas
              </h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
                <Link href="/tiendas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tiendas</Link>
                <Link href="/eats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Eats</Link>
                <Link href="/mayoristas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mayoristas</Link>
                <Link href="/como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</Link>
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
                  <a href="https://wa.me/34666953174" className="text-foreground hover:text-primary transition-colors">
                    +34 666 95 31 74
                  </a>
                </div>
                <Link href="/mayoristas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mayoristas
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
