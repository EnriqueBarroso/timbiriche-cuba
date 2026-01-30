"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowLeft, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  // Obtenemos los datos del contexto
  const { items, removeItem, cartTotal, clearCart } = useCart();

  // 🔥 CORRECCIÓN DEL ERROR:
  // Aseguramos que el total sea un número. Si es undefined/null, usamos 0.
  const safeTotal = cartTotal || 0;

  // --- GENERADOR DE PEDIDO WHATSAPP ---
  const generateWhatsAppOrder = () => {
    if (items.length === 0) return "";

    let message = "Hola! 👋 Quiero realizar el siguiente pedido en Timbiriche:\n\n";
    
    items.forEach((item) => {
      message += `▪️ ${item.quantity}x *${item.title}* - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💰 *TOTAL ESTIMADO: $${safeTotal.toFixed(2)}*`;
    message += `\n\nQuedo a la espera para coordinar la entrega. Gracias!`;

    // Usamos un número genérico de soporte o administración
    // En el futuro, esto podría separar pedidos por vendedor
    const adminPhone = "5300000000"; 
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  };

  // --- ESTADO VACÍO ---
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Parece que aún no has añadido nada. Explora nuestros productos y encuentra algo genial.
        </p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  // --- CARRITO CON PRODUCTOS ---
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras ({items.length})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA DE ITEMS (Izquierda) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.01]"
              >
                {/* Imagen */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Detalles */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={clearCart}
              className="text-sm text-gray-500 underline hover:text-red-500 transition-colors px-4"
            >
              Vaciar carrito
            </button>
          </div>

          {/* RESUMEN DE ORDEN (Derecha / Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${safeTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span className="text-green-600 text-sm font-medium">A coordinar</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Total</span>
                  {/* 👇 AQUÍ ESTABA EL ERROR (Ahora usamos safeTotal) */}
                  <span className="text-2xl font-extrabold text-gray-900">
                    ${safeTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* BOTÓN WHATSAPP */}
              <a 
                href={generateWhatsAppOrder()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-white font-bold text-lg shadow-md hover:bg-[#20bd5a] hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <MessageCircle size={22} />
                Pedir por WhatsApp
              </a>

              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                Al hacer clic, se abrirá WhatsApp con el detalle de tu pedido listo para enviar.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}