"use client";

import { Minus, Plus, Utensils } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

interface MenuItemProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    sellerId: string;
    image?: string; 
  };
}

export default function MenuItemCard({ product }: MenuItemProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const hasValidImage = typeof product.image === "string" && (product.image.startsWith("http") || product.image.startsWith("/"));

  const handleAdd = () => {
    addItem({ id: product.id, title: product.title, price: product.price }, product.sellerId);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    // Añadimos un hover suave para que reaccione al pasar el dedo o el ratón
    <div className="group flex gap-4 p-4 bg-white border-b border-gray-100 w-full hover:bg-red-50/40 transition-colors duration-300 last:border-0">
      
      {/* Imagen del Plato (Miniatura) */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
        {hasValidImage ? (
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Utensils className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Información del plato */}
      <div className="flex flex-col flex-1 justify-between py-1">
        <div>
          <h3 className="text-[15px] font-black text-gray-800 leading-tight mb-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Precio y Botón Agregar (Rediseñados) */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-black text-gray-900 tracking-tight">
            ${product.price.toFixed(2)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="text-xs font-bold text-[#D32F2F] bg-red-50 border border-red-100 rounded-full px-5 py-1.5 hover:bg-[#D32F2F] hover:text-white transition-all active:scale-95 shadow-sm"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 rounded-full border border-gray-200 p-1 shadow-inner">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-gray-700 shadow-sm hover:text-[#D32F2F] transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm font-black text-gray-800 w-4 text-center">{quantity}</span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 flex items-center justify-center bg-[#D32F2F] rounded-full text-white shadow-sm hover:bg-red-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}