import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, ShoppingBag, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-red-600 transition-colors">Inicio</Link></li>
              <li><Link href="/vender" className="hover:text-red-600 transition-colors">Vender un producto</Link></li>
              <li><Link href="/buscar" className="hover:text-red-600 transition-colors">Todas las Categorías</Link></li>
              <li><Link href="/favoritos" className="hover:text-red-600 transition-colors">Mi Lista de Deseos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-red-600 transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Reglas de Publicación</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Consejos de Seguridad</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Reportar un problema</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contáctanos</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>soporte@timbiriche.cu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+53 5 555 5555</span>
              </li>
              <li className="pt-2">
                <p className="text-xs text-gray-400 mb-2">Hecho con ❤️ en La Habana</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior: Copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {currentYear} Timbiriche. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Privacidad</a>
            <a href="#" className="hover:text-gray-900">Términos</a>
            <a href="#" className="hover:text-gray-900">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}