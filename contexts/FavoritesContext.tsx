"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

// Definimos qué datos guardamos de cada favorito
export type FavoriteItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  currency: string;
  seller?: {
    name: string;
    phone: string;
    avatar?: string;
  };
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  favoritesCount: number;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Usamos un ref para evitar que la carga inicial vacía sobrescriba el localStorage
  const isFirstRender = useRef(true);

  // 1. CARGAR FAVORITOS AL INICIO
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("timbiriche-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    }
  }, []);

  // 2. GUARDAR FAVORITOS CUANDO CAMBIEN
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (isMounted) {
      localStorage.setItem("timbiriche-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isMounted]);

  // --- FUNCIONES LÓGICAS ---

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites((prev) => {
      // Si ya existe, no hacemos nada (evitar duplicados)
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((i) => i.id !== id));
  };

  // Verifica si un ID ya está en la lista
  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  // Función inteligente: Si está lo quita, si no está lo pone
  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
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
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};