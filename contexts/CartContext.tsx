"use client";

import { createContext, useContext, useEffect, useState } from "react";
// ❌ BORRAMOS EL IMPORT DE TOAST AQUÍ, YA NO HACE FALTA
// import { toast } from "sonner"; 
import { toast } from "sonner"; // Puedes dejarlo para removeItem si quieres, pero para addItem NO.

// ... (El resto de tus types siguen igual) ...
export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  currency: string;
  sellerName?: string;
};

interface CartContextType {
  items: CartItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addItem: (product: any) => void;
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
        // ❌ AQUÍ BORRAMOS EL TOAST.SUCCESS (Ya lo hace la UI)
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const mainImage = product.images?.[0]?.url || product.image || "https://placehold.co/600x400";
      
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: mainImage,
        quantity: 1,
        currency: product.currency || "USD",
        sellerName: product.seller?.storeName || "Vendedor"
      };
      
      // ❌ AQUÍ TAMBIÉN BORRAMOS EL TOAST.SUCCESS
      return [...currentItems, newItem];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    toast.error("Eliminado del carrito"); // Este lo puedes dejar si quieres, o quitarlo también.
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