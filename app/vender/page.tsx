// app/vender/page.tsx
import SellForm from "@/components/SellForm";
import { Store, TrendingUp } from "lucide-react";

export default function VenderPage() {
  return (
    // Añadimos 'pb-32' para dejar espacio extra abajo y que se vea el botón
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-2xl mx-auto">
        
        {/* Encabezado para Emprendedores */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
              Panel de Vendedor
            </span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Impulsa tu <span className="text-blue-600">Negocio</span>
          </h1>
          <p className="mt-3 text-base text-gray-500">
            Publica tus productos en el Timbiriche Digital. Ideal para mypimes, artesanos y vendedores locales que quieren llegar a más clientes.
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Mayor visibilidad</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Contacto directo WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <SellForm />
        
      </div>
    </div>
  );
}