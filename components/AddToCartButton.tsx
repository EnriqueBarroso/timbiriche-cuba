"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner"; // Asegúrate de tener instalado sonner, si no usa alert()

interface Props {
  product: {
    id: string | number;
    title: string;
    price: number;
    images: { url: string }[];
    currency?: string; // Hacemos opcional por si acaso
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
       price: product.price / 100, // DB en centavos -> App en dólares
       image: product.images[0]?.url || "/placeholder.jpg",
       quantity: 1,       // 👈 FALTABA ESTO
       currency: "USD"    // 👈 FALTABA ESTO (O usa product.currency si lo tienes)
    });

    // Feedback visual
    // Si no tienes 'sonner' instalado, cambia esto por console.log o alert
    toast.success("Añadido al carrito");
  };
  
  return (
    <button 
      onClick={handleAddToCart}
      className="w-full h-full min-h-[50px] bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm active:scale-95"
      title="Añadir al carrito"
      aria-label="Añadir al carrito"
    >
      <ShoppingCart className="w-6 h-6" />
    </button>
  );
}