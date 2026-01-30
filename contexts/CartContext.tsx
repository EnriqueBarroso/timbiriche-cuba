"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  currency: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("timbiriche-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isMounted) {
      localStorage.setItem("timbiriche-cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      return existing
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const cartCount = items.reduce((a, c) => a + c.quantity, 0);
  const cartTotal = items.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
};