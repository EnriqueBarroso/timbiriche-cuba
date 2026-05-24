import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";

// Componentes UI
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import SyncUser from "@/components/SyncUser";
import BottomNav from "@/components/BottomNav";
import AdminButton from "@/components/AdminButton";
import CookieNotice from "@/components/CookieNotice";
import { GoogleAnalytics } from '@next/third-parties/google';

// Providers (Contextos)
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

// Configuración de la URL base para SEO
// Prioriza tu dominio real en producción
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff", // Puedes cambiar esto al color principal de tu marca
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LaChopin | Tu Mercado Online en Cuba",
    template: "%s | LaChopin",
  },
  description:
    "La forma más fácil de comprar y vender en Cuba. Ropa, celulares, electrodomésticos y más. LaChopin conecta a vendedores y compradores de forma segura.",
  keywords: [
    "cuba",
    "compras online",
    "ventas cuba",
    "lachopin",
    "celulares",
    "ropa",
    "marketplace",
    "revolico", // Palabra clave estratégica para SEO en Cuba
    "clasificados",
  ],
  authors: [{ name: "LaChopin Team" }],
  creator: "LaChopin",
  publisher: "LaChopin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "LaChopin 🇨🇺 - Lo que buscas, lo tienes",
    description: "Descubre miles de productos cerca de ti en Cuba. Compra seguro, rápido y fácil.",
    url: "https://www.lachopin.com",
    siteName: "LaChopin",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png", // ¡Recuerda actualizar esta imagen en la carpeta public!
        width: 1200,
        height: 630,
        alt: "LaChopin Cuba Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaChopin Cuba",
    description: "Tu nuevo marketplace favorito en Cuba.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "Nzf6-O8WHWnyktJv2kTAffTX65ANuA0BEkChzgaWYpc", // 👇 Añade esta línea
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
          {/* Sincronización de Usuario (Invisible) */}
          <SyncUser />

          {/* Estado Global (Carrito y Favoritos) */}
          <CartProvider>
            <FavoritesProvider>

              {/* Layout Principal */}
              <div className="flex min-h-screen flex-col pb-20 md:pb-0">

                {/* Navbar Superior */}
                <Navbar />

                {/* Botón de Admin Flotante (Solo visible para admins según lógica interna) */}
                <div className="fixed top-20 right-4 z-50 md:top-24">
                  <AdminButton />
                </div>

                {/* Contenido Principal */}
                <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </main>

                {/* Footer */}
                <Footer />

                {/* Navegación Móvil Inferior */}
                <BottomNav />
              </div>

            </FavoritesProvider>
          </CartProvider>

          {/* Utilidades Globales */}
          <Toaster position="bottom-center" richColors closeButton />
          <CookieNotice />

        </body>
        <GoogleAnalytics gaId="G-BZ481X6JRL" />
      </html>
    </ClerkProvider>
  );
}