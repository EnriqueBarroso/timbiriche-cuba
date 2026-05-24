"use client";

import { createContext, useContext, useEffect, useState } from "react";
// Eliminamos la importación de toast aquí para evitar duplicados
import { Product } from "@/types"; 

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
    // Normalizamos el objeto
    const newItem: FavoriteItem = {
      id: product.id,
      title: product.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      price: (product as any).price, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: (product as any).images?.[0]?.url || (product as any).image || "/placeholder.jpg",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currency: (product as any).currency || "USD",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      seller: (product as any).seller
    };

    if (!isFavorite(newItem.id)) {
      setFavorites((prev) => [...prev, newItem]);
      // 🔇 QUITADO: toast.success("Añadido a favoritos ❤️"); -> Lo maneja el botón
    }
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
    // 🔇 QUITADO: toast.info("Eliminado de favoritos"); -> Lo maneja el botón
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