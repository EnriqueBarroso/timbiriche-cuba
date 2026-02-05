"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Mail, Phone, ShoppingBag, ShoppingCart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // 1. Definimos las zonas donde queremos el Footer Pequeño (Minimalista)
  const isWorkspace = 
    pathname === "/mis-publicaciones" || 
    pathname === "/vender" || 
    pathname === "/favoritos" || 
    pathname === "/carrito" || 
    pathname?.startsWith("/perfil") ||
    pathname?.startsWith("/product/") || 
    pathname?.startsWith("/editar/"); 

  // 2. Si estamos en zona de trabajo, mostramos el diseño "que mola" (Pequeño)
  if (isWorkspace) {
    return (
      <footer className="bg-gray-50 py-6 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
        <p>© {currentYear} Timbiriche. Tu espacio.</p>
      </footer>
    );
  }

  // 3. Si no, mostramos el Footer Completo
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Grid de 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Columna 1: Marca */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-red-600 text-white p-1.5 rounded-lg group-hover:rotate-3 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Timbi<span className="text-blue-600">riche</span> 🇨🇺
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              La plataforma más rápida para comprar y vender en Cuba. 
              Conectamos gente real con productos reales, sin complicaciones.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-red-600 transition-colors">Inicio</Link></li>
              <li><Link href="/vender" className="hover:text-red-600 transition-colors">Vender un producto</Link></li>
              <li><Link href="/?category=all" className="hover:text-red-600 transition-colors">Todas las Categorías</Link></li>
              <li>
                <Link href="/carrito" className="hover:text-red-600 transition-colors flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Mi Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/ayuda" className="hover:text-red-600 transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/ayuda#seguridad" className="hover:text-red-600 transition-colors">Consejos de Seguridad</Link></li>
              <li><Link href="/terminos" className="hover:text-red-600 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/ayuda#contacto" className="hover:text-red-600 transition-colors">Reportar un problema</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contáctanos</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:soporte@timbiriche.cu" className="hover:text-red-600 transition-colors">
                  soporte@timbiriche.cu
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                  +53 5 555 5555
                </a>
              </li>
              <li className="pt-2">
                <p className="text-xs text-gray-400">Hecho con ❤️ en La Barcelona</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior: Copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {currentYear} Timbiriche. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/terminos#privacidad" className="hover:text-gray-900 transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-gray-900 transition-colors">Términos</Link>
            <Link href="/ayuda" className="hover:text-gray-900 transition-colors">Ayuda</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}