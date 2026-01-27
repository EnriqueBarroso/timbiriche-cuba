// app/checkout/page.tsx
import CheckoutForm from "@/components/CheckoutForm";
import OrderSummary from "@/components/OrderSummary";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cabecera Simple */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/carrito" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div className="flex-1">
             <h1 className="text-lg font-bold text-gray-900 leading-none">Confirmar Pedido</h1>
             <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
               <ShieldCheck className="w-3 h-3 text-green-600" /> Pago 100% Seguro
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Orden Inverso en Móvil: Primero Resumen, luego Formulario */}
          
          {/* Columna Derecha (Resumen) - En PC va a la derecha */}
          <div className="lg:col-span-5 lg:col-start-8 lg:order-2 mb-6 lg:mb-0">
             <OrderSummary />
          </div>

          {/* Columna Izquierda (Formulario) */}
          <div className="lg:col-span-7 lg:col-start-1 lg:order-1">
             <CheckoutForm />
          </div>

        </div>
      </div>
    </div>
  )
}