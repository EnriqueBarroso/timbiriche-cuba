"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook, Instagram, Twitter, ShoppingBag } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // 1. Detectamos si estamos en una página que necesita el footer resumido
  const isProductPage = pathname?.startsWith("/product/");

  // ------------------------------------------------------------------
  // 2. VERSIÓN MINIMALISTA (Solo para la página de producto)
  // ------------------------------------------------------------------
  if (isProductPage) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 pt-6 pb-28 md:pb-6 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 px-4">
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
          </div>
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
  // 3. VERSIÓN COMPLETA (Con tus enlaces personalizados)
  // ------------------------------------------------------------------
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Grid: 2 columnas en móvil, 6 en pantallas grandes */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Columna 1: Marca y Redes (Ocupa 2 espacios en PC y todo el ancho en móvil) */}
          <div className="col-span-2 lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LaChopin</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6">
              Tu mercado online en Cuba. Compra y vende de forma segura, rápida y sin comisiones ocultas.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Columna 2: Comprar */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">Comprar</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
              <li><Link href="/ofertas" className="hover:text-blue-600 transition-colors">Ofertas Flash</Link></li>
              <li><Link href="/categorias" className="hover:text-blue-600 transition-colors">Categorías</Link></li>
              <li><Link href="/favoritos" className="hover:text-blue-600 transition-colors">Favoritos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Vender */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">Vender</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/publicar" className="hover:text-blue-600 transition-colors">Publicar Anuncio</Link></li>
              <li><Link href="/mi-tienda" className="hover:text-blue-600 transition-colors">Mi Tienda</Link></li>
              <li><Link href="/consejos" className="hover:text-blue-600 transition-colors">Consejos de Venta</Link></li>
              <li><Link href="/premium" className="hover:text-blue-600 transition-colors">Vendedor Premium</Link></li>
            </ul>
          </div>

          {/* Columna 4: Soporte */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">Soporte</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/ayuda" className="hover:text-blue-600 transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/reglas" className="hover:text-blue-600 transition-colors">Reglas</Link></li>
              <li><Link href="/seguridad" className="hover:text-blue-600 transition-colors">Seguridad</Link></li>
              <li><Link href="/contacto" className="hover:text-blue-600 transition-colors">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Columna 5: Legal */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/privacidad" className="hover:text-blue-600 transition-colors">Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-blue-600 transition-colors">Términos</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link></li>
            </ul>
          </div>

        </div>

        {/* Línea final (Copyright) */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} LaChopin. Todos los derechos reservados.
          </p>
          <div className="text-sm text-gray-400 flex gap-4">
            <span>Hecho con ❤️ para Cuba</span>
          </div>
        </div>
      </div>
    </footer>
  );
}