"use client";

import { Heart } from "lucide-react";
import { useFavorites, FavoriteItem } from "@/contexts/FavoritesContext";

interface Props {
  product: FavoriteItem; // Recibimos el objeto completo
}

export default function FavoriteButton({ product }: Props) {
  // Usamos el hook del contexto en lugar de Server Actions
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Comprobamos si YA está en favoritos
  const isLiked = isFavorite(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita entrar al producto
    e.stopPropagation();
    
    // Guardamos/Quitamos del LocalStorage
    toggleFavorite(product);
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