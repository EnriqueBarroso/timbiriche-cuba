"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
// Importamos Product solo para recibirlo en la función addItem, 
// pero NO lo usaremos para heredar el tipo CartItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Product } from "@/types"; // O "any" si prefieres evitar líos de tipos por ahora

// 1. DEFINICIÓN MANUAL (Para asegurar que 'image' existe y es string)
export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;      // 👈 AQUÍ ESTÁ EL ARREGLO (Singular y String)
  quantity: number;
  currency: string;
  sellerName?: string;
};

interface CartContextType {
  items: CartItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addItem: (product: any) => void; // Usamos any en la entrada para ser flexibles con lo que viene de la DB
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar del LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("timbiriche-cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Guardar en LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("timbiriche-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // --- FUNCIONES ---

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addItem = (product: any) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        toast.success("Cantidad actualizada");
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 🔍 TRUCO: Detectamos la imagen correcta antes de guardar
      // Si viene 'images' (array), cogemos la primera. Si viene 'image' (string), la usamos.
      const mainImage = product.images?.[0]?.url || product.image || "https://placehold.co/600x400";
      
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: mainImage, // 👈 Guardamos el string limpio
        quantity: 1,
        currency: product.currency || "USD",
        sellerName: product.seller?.storeName || "Vendedor"
      };

      toast.success("Añadido al carrito");
      return [...currentItems, newItem];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    toast.error("Eliminado del carrito");
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