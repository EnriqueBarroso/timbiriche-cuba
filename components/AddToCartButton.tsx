"use client"

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner"; 

interface Props {
  product: {
    id: string | number;
    title: string;
    price: number;
    images: { url: string }[]; 
  };
  compact?: boolean; 
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
       id: String(product.id),
       title: product.title,
       price: product.price / 100, // Recuerda: DB en centavos -> App en dólares
       image: product.images[0]?.url || "https://placehold.co/200",
    });

    // IMPORTANTE: Feedback para el usuario
    toast.success("Guardado en tu lista");
  };
  
  return (
    <button 
      onClick={handleAddToCart}
      className="w-full h-full min-h-[50px] bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm active:scale-95"
      title="Guardar en mi lista"
      aria-label="Guardar producto"
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  );
}