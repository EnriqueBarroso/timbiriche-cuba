"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
// Definimos los tipos, asegúrate de que coincidan con los tuyos
import { Product } from "@/types"; 

export type CartItem = Product & {
  quantity: number;
  selectedVariant?: string; // Por si tienes tallas/colores
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoaded: boolean; // Para saber si ya leímos localStorage
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar del LocalStorage al iniciar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try {
      const savedCart = localStorage.getItem("timbiriche-cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    } finally {
      // Marcamos como cargado AL FINAL para evitar parpadeos
      setIsLoaded(true);
    }
  }, []);

  // 2. Guardar en LocalStorage cada vez que cambian los items
  useEffect(() => {
    if (isLoaded) { // Solo guardamos si ya terminamos la carga inicial
      localStorage.setItem("timbiriche-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // --- FUNCIONES DEL CARRITO ---

  const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        toast.success("Cantidad actualizada en el carrito");
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success("Producto añadido al carrito");
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    toast.error("Producto eliminado");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Carrito vaciado");
  };

  // Cálculos derivados
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isLoaded
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}