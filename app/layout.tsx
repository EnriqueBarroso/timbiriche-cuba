import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import SyncUser from "@/components/SyncUser";
import BottomNav from "@/components/BottomNav";
import AdminButton from "@/components/AdminButton";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.VERCEL_URL
  ? `https://timbiriche-cuba.vercel.app/`
  : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Timbiriche Cuba | Compra y Vende Fácil",
    template: "%s | Timbiriche Cuba",
  },
  description:
    "La tienda online más rápida de Cuba. Encuentra ropa, tecnología, alimentos y más. Conecta directamente con vendedores verificados.",
  keywords: [
    "cuba",
    "ventas",
    "tienda online",
    "ropa",
    "celulares",
    "timbiriche",
    "compra venta",
  ],
  authors: [{ name: "Timbiriche Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Timbiriche Cuba 🇨🇺",
    description: "Descubre miles de productos cerca de ti. Compra seguro y rápido.",
    url: baseUrl,
    siteName: "Timbiriche",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Timbiriche Cuba Portada",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timbiriche Cuba",
    description: "Compra y vende en Cuba fácil y rápido.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={inter.className}>
          <SyncUser />

          <CartProvider>
            <FavoritesProvider>

              {/* 👇 BOTÓN FLOTANTE BIEN POSICIONADO */}
              <div className="fixed top-20 right-4 z-50 md:top-4">
                <AdminButton />
              </div>

              <div className="flex min-h-screen flex-col pb-20 md:pb-0">
                <Navbar />
                <main className="flex-grow bg-gray-50">
                  {children}
                </main>
                <Footer />
                <BottomNav />
              </div>

            </FavoritesProvider>
          </CartProvider>

          <Toaster position="bottom-center" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}