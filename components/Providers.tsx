"use client"

import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner"; // Las notificaciones

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster position="top-center" richColors />
    </CartProvider>
  );
}