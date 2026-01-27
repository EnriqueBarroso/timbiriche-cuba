import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. IMPORTAR AQUI
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timbiriche",
  description: "Marketplace Cubano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${inter.className} bg-red-100 text-gray-900 antialiased min-h-screen flex flex-col`}>
          {/* Nota: añadí 'min-h-screen flex flex-col' al body para empujar el footer abajo si la pagina es corta */}
          
          <CartProvider>
            <Navbar />
            
            {/* El contenido principal crece para ocupar el espacio disponible */}
            <main className="flex-1">
              {children}
            </main>

            {/* 2. AÑADIR AQUI AL FINAL */}
            <Footer />
            
          </CartProvider>
          
        </body>
      </html>
    </ClerkProvider>
  );
}