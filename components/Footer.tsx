"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook, Instagram, Twitter, ShoppingBag, ShieldCheck, Mail, MapPin } from "lucide-react";

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
  // 3. VERSIÓN COMPLETA (Para el inicio, categorías, perfil, etc.)
  // ------------------------------------------------------------------
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* 👇 AQUÍ ESTÁ LA MAGIA DEL GRID (2 columnas móvil, 4 PC) 👇 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Columna 1: Marca y Redes (Ocupa 2 columnas en móvil para que el texto respire) */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LaChopin</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 pr-4">
              Tu mercado online en Cuba. Compra y vende de forma segura, rápida y sin comisiones ocultas.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Columna 2: Categorías (Ocupa 1 columna) */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">Categorías</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Celulares</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Ropa y Calzado</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Electrodomésticos</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Hogar</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal y Soporte (Ocupa 1 columna) */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">La Empresa</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/contacto" className="hover:text-blue-600 transition-colors">Ayuda</Link></li>
              <li><Link href="/seguridad" className="hover:text-blue-600 transition-colors">Seguridad</Link></li>
              <li><Link href="/terminos" className="hover:text-blue-600 transition-colors">Términos</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto directo (Ocupa 2 columnas en móvil, 1 en PC) */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-gray-900 mb-4">Contáctanos</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600 shrink-0" />
                <span className="truncate">hola@lachopin.com</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                <span>Plataforma Segura</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-red-500 shrink-0" />
                <span>Cuba</span>
              </li>
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