import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. IMPORTANTE: Recuperamos Clerk
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations"; // Opcional: Para que el login salga en español

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timbiriche Cuba",
  description: "Tu tienda online en Cuba",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. ClerkProvider debe ser el PRIMERO, envolviendo incluso el HTML (o justo dentro)
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={inter.className}>
          
          <CartProvider>
            <FavoritesProvider>
              
              <div className="flex min-h-screen flex-col">
                <Navbar />
                
                <main className="flex-grow bg-gray-50">
                  {children}
                </main>

                <Footer />
              </div>

            </FavoritesProvider>
          </CartProvider>

          <Toaster position="bottom-center" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}