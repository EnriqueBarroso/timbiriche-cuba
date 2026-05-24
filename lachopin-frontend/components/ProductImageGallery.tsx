"use client"
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  // Si no hay imágenes, mostramos una por defecto
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 flex items-center justify-center text-gray-400 rounded-xl">
        Sin imagen
      </div>
    );
  }

  const totalImages = images.length;

  // Funciones de navegación
  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalImages);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  // Touch handlers para swipe en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < totalImages - 1) {
      goToNext();
    }
    
    if (isRightSwipe && activeIndex > 0) {
      goToPrev();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative">
      
      {/* Imagen Principal */}
      <div 
        ref={imageRef}
        className="aspect-square lg:aspect-[4/3] overflow-hidden bg-gray-100 md:rounded-xl relative group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[activeIndex]}
          alt={`Producto - Imagen ${activeIndex + 1}`}
          className="w-full h-full object-cover select-none"
          draggable={false}
        />

        {/* Botones de navegación - Solo desktop */}
        {totalImages > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Contador de imágenes - Esquina superior derecha */}
        {totalImages > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            {activeIndex + 1} / {totalImages}
          </div>
        )}

        {/* Indicadores (Dots) - Visibles en móvil */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all ${
                  activeIndex === index
                    ? "w-8 h-2 bg-white rounded-full"
                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/70"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas (Thumbnails) - Ocultas en móvil, visibles en tablet+ */}
      {totalImages > 1 && (
        <div className="hidden sm:flex gap-2 md:gap-3 mt-3 md:mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-200"
              }`}
            >
              <img
                src={image}
                alt={`Vista ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Hint de swipe - Solo móvil, solo si hay múltiples imágenes */}
      {totalImages > 1 && activeIndex === 0 && (
        <div className="sm:hidden text-center mt-3">
          <p className="text-xs text-gray-500 animate-pulse">
            👈 Desliza para ver más fotos 👉
          </p>
        </div>
      )}
    </div>
  );
}