"use client";

import { Heart } from "lucide-react";
import { useFavorites, FavoriteItem } from "@/contexts/FavoritesContext";
import { toast } from "sonner"; // 👇 Importamos Sonner

interface Props {
  product: FavoriteItem;
}

export default function FavoriteButton({ product }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Comprobamos si YA está en favoritos
  // (Nota: isFavorite es una función en tu contexto, así que la llamamos)
  // Si en tu contexto isFavorite fuera un array, avísame, pero asumo que es función por tu código anterior.
  const isLiked = isFavorite(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // 1. Ejecutamos la lógica de guardar/borrar
    toggleFavorite(product);

    // 2. Mostramos el mensaje CORTO (1 seg) según el estado ANTERIOR al click
    if (isLiked) {
      // Si ya gustaba y le damos click -> Lo estamos borrando
      toast.info("Eliminado de favoritos", {
        duration: 1000, // ⚡ Rápido
        icon: "🗑️"
      });
    } else {
      // Si no gustaba -> Lo estamos guardando
      toast.success("Guardado en favoritos", {
        duration: 1000, // ⚡ Rápido
        icon: "❤️"
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex h-9 w-9 items-center justify-center rounded-full 
        backdrop-blur-sm shadow-sm transition-all duration-200
        hover:scale-110 active:scale-95 z-20
        ${isLiked 
          ? "bg-white text-red-500 hover:bg-red-50" 
          : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
        }
      `}
      title={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <Heart 
        className={`h-5 w-5 transition-colors ${isLiked ? "fill-current" : ""}`} 
        strokeWidth={2}
      />
    </button>
  );
}