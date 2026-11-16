"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { LACHOPIN_CONTACT_EMAIL, LACHOPIN_WHATSAPP_DISPLAY, getLaChopinWhatsAppUrl } from "@/lib/contact";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer className="border-t border-border bg-card py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span className="rounded-lg bg-primary p-1.5 text-primary-foreground"><ShoppingBag className="h-5 w-5" /></span>
              <span className="text-xl font-bold tracking-tight text-foreground">La<span className="text-primary">Chopin</span></span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Descubre negocios cubanos y crea una presencia digital para tu propio comercio.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Explorar</h2>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/tiendas" className="hover:text-foreground">Tiendas</Link>
              <Link href="/eats" className="hover:text-foreground">Eats</Link>
              <Link href="/mayoristas" className="hover:text-foreground">Mayoristas</Link>
              <Link href="/como-funciona" className="hover:text-foreground">Cómo funciona</Link>
            </nav>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Para negocios</h2>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/servicios-digitales" className="hover:text-foreground">Servicios digitales</Link>
              <Link href="/vender" className="hover:text-foreground">Únete a LaChopin</Link>
              <Link href="/ayuda" className="hover:text-foreground">Ayuda y soporte</Link>
              <Link href="/seguridad" className="hover:text-foreground">Seguridad</Link>
            </nav>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contacto</h2>
            <div className="flex flex-col gap-3 text-sm">
              <a href={`mailto:${LACHOPIN_CONTACT_EMAIL}`} className="text-foreground hover:text-primary">{LACHOPIN_CONTACT_EMAIL}</a>
              <a href={getLaChopinWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">WhatsApp: {LACHOPIN_WHATSAPP_DISPLAY}</a>
              <Link href="/contacto" className="text-muted-foreground hover:text-foreground">Formulario de contacto</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center md:flex-row md:text-left">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LaChopin. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/terminos" className="hover:text-foreground">Términos y condiciones</Link>
            <Link href="/privacidad" className="hover:text-foreground">Privacidad</Link>
            {isHomePage && <span>Hecho con ❤️ para Cuba</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
