// app/carrito/page.tsx
"use client"

import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext"; // <--- 1. Importamos el Cerebro

export default function CartPage() {
  // 2. Usamos los datos reales del contexto
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pb-40 lg:pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3 max-w-3xl mx-auto">
          <Link href="/" className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Mi Carrito</h1>
          {totalItems > 0 && (
            <span className="text-sm text-gray-500 font-medium">
              ({totalItems} {totalItems === 1 ? "producto" : "productos"})
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
               <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Explora nuestros productos y añade tus favoritos para enviar a Cuba.
            </p>
            <Link href="/" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                {/* Imagen */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate leading-tight">{item.title}</h3>
                    <p className="text-blue-600 font-bold mt-1 text-lg">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Controles de Cantidad */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 text-gray-600 transition-colors active:scale-95"
                        >
                        <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-10 text-center text-gray-900 text-sm">
                        {item.quantity}
                        </span>
                        <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 text-blue-600 transition-colors active:scale-95"
                        >
                        <Plus className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>

                {/* Botón Borrar */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Fijo con Total y Botón Pagar */}
      {items.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-30">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Total estimado</span>
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Link href="/checkout" className="block w-full">
              <button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-xl shadow-blue-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                Proceder al Pago <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};