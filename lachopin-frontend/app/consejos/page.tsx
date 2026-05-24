import Link from "next/link";
import { Camera, Tag, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consejos para Vender",
  description:
    "Aprende a tomar mejores fotos, poner precios competitivos y vender más rápido en LaChopin.",
};

export default function SellingTipsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 py-16 text-center text-white">
        <h1 className="text-3xl font-black md:text-5xl mb-4">Vende más rápido en LaChopin</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg px-4">
          Sigue estos consejos simples para destacar tus productos y cerrar tratos en tiempo récord.
        </p>
      </div>

      {/* Grid de Consejos */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid gap-12 md:grid-cols-2">
        
        <div className="flex gap-4 items-start">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Fotos que enamoren</h3>
            <p className="text-gray-600 leading-relaxed">
              La primera impresión cuenta. Usa luz natural, limpia el producto y toma fotos desde varios ángulos. Evita las fotos borrosas o capturas de pantalla de internet.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <Tag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. El precio justo</h3>
            <p className="text-gray-600 leading-relaxed">
              Investiga cuánto cuesta tu producto nuevo y usado. Un precio competitivo atrae más compradores. Evita poner Precio al privado, eso aleja a los clientes.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Descripción honesta</h3>
            <p className="text-gray-600 leading-relaxed">
              Detalla el estado real del producto. Si tiene un detalle, dilo. La honestidad genera confianza y evita problemas al momento de la entrega.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">4. Seguridad ante todo</h3>
            <p className="text-gray-600 leading-relaxed">
              Acuerda encuentros en lugares públicos y concurridos. Nunca envíes dinero por adelantado sin garantías. En LaChopin cuidamos a nuestra comunidad.
            </p>
          </div>
        </div>

      </div>

      {/* CTA Final */}
      <div className="bg-gray-50 py-12 text-center border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Listo para hacer negocio?</h2>
        <Link 
          href="/vender" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all"
        >
          Publicar Anuncio Ahora <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}