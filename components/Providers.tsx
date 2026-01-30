// 📂 Ruta: components/Providers.tsx
"use client";

// 👇 IMPORTANTE: Verifica que esta ruta sea correcta
import { CartProvider } from "@/contexts/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}