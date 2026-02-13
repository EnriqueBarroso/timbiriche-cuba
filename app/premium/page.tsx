import Link from "next/link";
import { Check, Star, Zap } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Membresía</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2 mb-4">Lleva tu negocio al siguiente nivel</h1>
        <p className="text-gray-600 text-lg">
          Destaca tus productos, obtén estadísticas detalladas y vende mucho más rápido con LaChopin Premium.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        
        {/* Plan Gratis */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-bold text-gray-900">Vendedor Estándar</h3>
          <p className="text-gray-500 mt-2">Para usuarios ocasionales.</p>
          <div className="my-6">
            <span className="text-4xl font-black text-gray-900">Gratis</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-600">
              <Check className="w-5 h-5 text-green-500" /> Publicar anuncios ilimitados
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <Check className="w-5 h-5 text-green-500" /> Chat con compradores
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <Check className="w-5 h-5 text-green-500" /> Visibilidad estándar
            </li>
          </ul>
          <Link href="/vender" className="block text-center w-full py-3 px-6 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors">
            Comenzar Gratis
          </Link>
        </div>

        {/* Plan Premium */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-900 shadow-2xl relative overflow-hidden text-white transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-transparent w-32 h-32 opacity-20 rounded-bl-full" />
          
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold uppercase text-sm">Recomendado</span>
          </div>
          
          <h3 className="text-2xl font-bold">Vendedor Pro</h3>
          <p className="text-gray-400 mt-2">Para negocios serios.</p>
          <div className="my-6 flex items-baseline gap-1">
            <span className="text-4xl font-black">10 USD</span>
            <span className="text-gray-400">/mes</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-200">
              <Zap className="w-5 h-5 text-blue-400" /> <span className="font-bold">Mayor visibilidad</span> en búsquedas
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Check className="w-5 h-5 text-blue-400" /> Insignia de Vendedor Verificado
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Check className="w-5 h-5 text-blue-400" /> Estadísticas de visitas
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Check className="w-5 h-5 text-blue-400" /> Soporte prioritario por WhatsApp
            </li>
          </ul>
          
          <button className="block text-center w-full py-3 px-6 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 transition-colors">
            Unirse a la lista de espera
          </button>
          <p className="text-xs text-center text-gray-500 mt-4">
            * Próximamente disponible en LaChopin.
          </p>
        </div>

      </div>
    </div>
  );
}