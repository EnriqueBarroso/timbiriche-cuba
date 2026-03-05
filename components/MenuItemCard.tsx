"use client";

import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

interface MenuItemProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    sellerId: string;
    image?: string; // Asumimos que podemos pasarle una imagen
  };
}

export default function MenuItemCard({ product }: MenuItemProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({ id: product.id, title: product.title, price: product.price }, product.sellerId);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-white border-b border-gray-100 w-full">
      {/* Imagen del Plato (Miniatura) */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
        )}
      </div>

      {/* Información del plato */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight">
            {/* El puntito verde/rojo que se ve en el diseño se puede simular así */}
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-snug">
            {product.description}
          </p>
          {/* Tiempo de preparación estático por ahora, o dinámico si lo agregas a Prisma */}
          <p className="text-[10px] text-gray-400 mt-1 font-medium">
            Tiempo de Preparación: 20 Minutos
          </p>
        </div>

        {/* Precio y Botón Agregar (Paso 1 del mockup) */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="text-xs font-semibold text-[#D32F2F] border border-[#D32F2F] rounded-md px-4 py-1.5 hover:bg-red-50 transition-colors"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold">{quantity}</span>
              <button
                onClick={handleAdd}
                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}