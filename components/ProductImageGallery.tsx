// components/ProductImageGallery.tsx
"use client" // <--- Importante: Esto habilita la interactividad
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Si no hay imágenes, mostramos una por defecto
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 flex items-center justify-center text-gray-400">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Imagen Principal */}
      <div className="aspect-square lg:aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl relative">
        <img
          src={images[activeIndex]}
          alt="Producto principal"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
      
      {/* Miniaturas (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index 
                  ? "border-blue-600 ring-2 ring-blue-100" 
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`Vista ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};