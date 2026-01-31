"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types"; // Asegúrate de que esta ruta sea correcta

// Definimos la estructura de un ítem favorito
// (Usualmente es igual al producto, o una versión simplificada)
export type FavoriteItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  currency: string;
  seller?: {
    name: string;
    phone?: string;
    avatar?: string;
  };
};

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: FavoriteItem | Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: FavoriteItem | Product) => void;
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. CARGAR FAVORITOS AL INICIO
  useEffect(() => {
    try {
      const saved = localStorage.getItem("timbiriche-favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      // Marcamos que ya se cargó para mostrar la UI real
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
    }
  }, []);

  // 2. GUARDAR CAMBIOS EN LOCALSTORAGE
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("timbiriche-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // --- FUNCIONES ---

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  const addToFavorites = (product: FavoriteItem | Product) => {
    // Normalizamos el objeto para guardar solo lo necesario
    const newItem: FavoriteItem = {
      id: product.id,
      title: product.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      price: (product as any).price, // Casting por seguridad si los tipos difieren
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: (product as any).images?.[0]?.url || (product as any).image || "/placeholder.jpg",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currency: (product as any).currency || "USD",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      seller: (product as any).seller
    };

    if (!isFavorite(newItem.id)) {
      setFavorites((prev) => [...prev, newItem]);
      toast.success("Añadido a favoritos ❤️");
    }
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
    toast.info("Eliminado de favoritos");
  };

  const toggleFavorite = (product: FavoriteItem | Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        isLoaded,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}