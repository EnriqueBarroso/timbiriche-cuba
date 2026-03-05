"use client";

import { useState } from "react";
import { ShoppingCart, X, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

// Recibimos los datos del restaurante como props desde la página principal
interface FloatingCartBarProps {
    sellerName: string;
    sellerPhoneNumber: string;
}

export default function FloatingCartBar({ sellerName, sellerPhoneNumber }: FloatingCartBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    // Si el carrito está vacío, no renderizamos absolutamente nada
    if (totalItems === 0) return null;

    // Hito 3: Compilador del mensaje de WhatsApp
    const handleWhatsAppCheckout = () => {
        let message = `¡Hola! Quisiera hacer un pedido 🛒\n\n`;
        message += `*Restaurante:* ${sellerName}\n`;
        message += `*Cliente:* [Escribe tu nombre y dirección aquí]\n\n`;
        message += `*Mi Pedido:*\n`;

        items.forEach((item) => {
            message += `${item.quantity}x ${item.title} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `--\n`;
        message += `*Total a Pagar:* $${totalPrice.toFixed(2)}\n`;

        // Codificamos el texto para que la URL sea válida
        const encodedMessage = encodeURIComponent(message);
        // Aseguramos que el número no tenga espacios ni el signo +
        const cleanPhone = sellerPhoneNumber.replace(/\D/g, '');

        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

        // Abrimos WhatsApp en una nueva pestaña/app
        window.open(whatsappUrl, "_blank");

        // Opcional: Cerrar el modal al enviar (puedes usar clearCart() aquí si deseas vaciar el pedido)
        setIsOpen(false);
    };

    return (
        <>
            {/* Barra Flotante (Bottom Bar) */}
            <div className="fixed bottom-0 left-0 w-full p-4 z-40 bg-transparent">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-black text-white rounded-full p-4 shadow-2xl flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white text-black rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                            {totalItems}
                        </div>
                        <span className="font-semibold text-base">Ver pedido</span>
                    </div>
                    <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                </button>
            </div>

            {/* Modal del Resumen (Paso 2 del Mockup) */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-full duration-300">

                        {/* Header Modal */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b">
                            <h2 className="text-lg font-bold text-gray-900">Tu Pedido en {sellerName}</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Lista de Productos del Carrito */}
                        <div className="max-h-[50vh] overflow-y-auto mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-col py-3 border-b border-gray-50">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-semibold text-gray-800">{item.title}</span>
                                        <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    {/* Controles + / - dentro del carrito como en el mockup */}
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center border border-gray-200 rounded-md">
                                            <button
                                                onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 text-gray-500 hover:bg-gray-50"
                                            >-</button>
                                            <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => useCartStore.getState().addItem(item, useCartStore.getState().sellerId!)} 
                                                className="px-3 py-1 text-gray-500 hover:bg-gray-50"
                                            >+</button>
                                        </div>
                                        <button className="text-xs text-gray-400 flex items-center gap-1">
                                            ✏️ Agregar Nota
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desglose de Totales (Subtotal, IVA, Total) */}
                        <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Artículo(s)</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            {/* Placeholder para IVA si lo necesitas en el futuro */}
                            {/* <div className="flex justify-between text-gray-500">
          <span>IVA (10%)</span>
          <span>${(totalPrice * 0.1).toFixed(2)}</span>
        </div> */}
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Botón "Siguiente" estilo Mockup */}
                        <button
                            onClick={handleWhatsAppCheckout}
                            className="w-full bg-[#D32F2F] text-white rounded-lg p-3 text-base font-bold text-center hover:bg-red-700 active:scale-95 transition-all"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}