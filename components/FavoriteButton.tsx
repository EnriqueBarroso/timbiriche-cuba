"use client"

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  initialIsFavorite: boolean;
}

export default function FavoriteButton({ productId, initialIsFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que al hacer click se abra el producto
    e.stopPropagation();

    if (isLoading) return;

    // 1. Cambio Optimista (Cambia el color YA, sin esperar al servidor)
    const newState = !isFavorite;
    setIsFavorite(newState);
    setIsLoading(true);

    try {
      // 2. Llamamos al servidor
      await toggleFavorite(productId);
    } catch (error) {
      // Si falla, revertimos el cambio
      setIsFavorite(!newState);
      alert("Hubo un error al guardar favorito");
    } finally {
      setIsLoading(false);
      router.refresh(); // Refresca los datos en segundo plano
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        p-2 rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm
        ${isFavorite ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-400 hover:text-red-400"}
      `}
    >
      <Heart 
        className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} 
        strokeWidth={2}
      />
    </button>
  );
}