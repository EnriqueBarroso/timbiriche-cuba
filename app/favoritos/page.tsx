"use client";

import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductCard } from "@/components/ProductCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
          <Heart size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin favoritos aún</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Guarda lo que te gusta para no perderlo de vista.
        </p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Explorar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Mis Favoritos ({favorites.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            // Reutilizamos la tarjeta, le pasamos el item como 'product'
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}