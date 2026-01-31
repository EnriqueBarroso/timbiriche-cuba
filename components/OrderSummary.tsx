// components/OrderSummary.tsx
"use client"

import { useCart } from "@/contexts/CartContext";

export default function OrderSummary() {
  const { items, cartTotal } = useCart();
  const envio = 0.00; // Podríamos hacerlo dinámico luego
  const total = cartTotal + envio;

  if (items.length === 0) {
    return null; // No mostrar nada si no hay items (o redirigir)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
      
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">Cantidad: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Envío</span>
          <span className="text-green-600 font-medium">Gratis</span> {/* O variable */}
        </div>
        <div className="flex justify-between items-center pt-2 text-base font-bold text-gray-900">
          <span>Total a Pagar</span>
          <span className="text-xl text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}