import Link from "next/link";
import { Store, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        
        {/* PARTE SUPERIOR: Logo y Redes */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:rotate-3 transition-transform">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900">
              Timbi<span className="text-blue-600">riche</span>
            </span>
          </Link>
          
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-sky-500 hover:bg-sky-50 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* PARTE CENTRAL: Grid de Enlaces (2 Columnas en Móvil / 4 en PC) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 mb-8 text-center md:text-left">
          
          {/* Columna 1 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Comprar</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
              <li><Link href="/ofertas" className="hover:text-blue-600">Ofertas Flash</Link></li>
              <li><Link href="/categorias" className="hover:text-blue-600">Categorías</Link></li>
              <li><Link href="/favoritos" className="hover:text-blue-600">Favoritos</Link></li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Vender</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/vender" className="hover:text-blue-600">Publicar Anuncio</Link></li>
              <li><Link href="/mis-publicaciones" className="hover:text-blue-600">Mi Tienda</Link></li>
              <li><Link href="/consejos" className="hover:text-blue-600">Consejos de Venta</Link></li>
              <li><Link href="/premium" className="hover:text-blue-600">Vendedor Premium</Link></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/ayuda" className="hover:text-blue-600">Centro de Ayuda</Link></li>
              <li><Link href="/reglas" className="hover:text-blue-600">Reglas</Link></li>
              <li><Link href="/seguridad" className="hover:text-blue-600">Seguridad</Link></li>
              <li><Link href="/contacto" className="hover:text-blue-600">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacidad" className="hover:text-blue-600">Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-blue-600">Términos</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600">Cookies</Link></li>
            </ul>
          </div>

        </div>

        {/* PARTE INFERIOR: Copyright */}
        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Timbiriche Cuba. Hecho con ❤️ para la isla.
          </p>
        </div>

      </div>
    </footer>
  );
}