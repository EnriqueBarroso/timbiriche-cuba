import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { CartProvider } from '@/contexts/CartContext'

import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Timbiriche',
  description: 'Marketplace cubano.',
}

export const viewport: Viewport = {
  themeColor: '#EFF6FF', // ← Cambié a azul claro (blue-50)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-blue-50 text-gray-900`}>

          <FavoritesProvider>
            <CartProvider>

              <Navbar />

              {/* ← Quité min-h-screen de main para que herede el bg del body */}
              <main className="flex-1">
                {children}
              </main>

              <Footer />

            </CartProvider>
          </FavoritesProvider>

        </body>
      </html>
    </ClerkProvider>
  )
}