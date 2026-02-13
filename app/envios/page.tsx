import Link from "next/link";
import { Truck, ArrowLeft, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-50" />
        
        <div className="bg-blue-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 relative z-10">
          <Truck size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">
          Envíos a Cuba
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-orange-600 font-bold bg-orange-50 py-1 px-3 rounded-full w-fit mx-auto mb-6">
            <Clock size={16} />
            <span className="text-sm">Próximamente</span>
        </div>

        <p className="text-gray-500 mb-8 leading-relaxed relative z-10">
          Estamos trabajando para conectar a las agencias de envío más rápidas contigo. Muy pronto podrás gestionar tus envíos directamente desde LaChopin.
        </p>

        <Link 
          href="/" 
          className="block w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95"
        >
          Volver a la tienda
        </Link>
      </div>

    </div>
  );
}