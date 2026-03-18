"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// 📝 Aquí definimos la información de tus 3 banners estratégicos
const BANNERS = [
  {
    id: "captacion",
    title: "Vende con nosotros",
    subtitle: "Digitaliza tu catálogo gratis y recibe pedidos por WhatsApp.",
    cta: "Crear mi tienda",
    href: "/vender",
    // Reemplaza esta URL con la imagen real que diseñes
    image: "/banners/banner-b2b.jpg", 
    color: "from-blue-900/90 to-blue-900/40", // Degradado para que el texto se lea bien
  },
  {
    id: "premium",
    title: "Ofertas Premium",
    subtitle: "Descubre los productos más destacados de LaChopin.",
    cta: "Ver ofertas",
    href: "/premium", // O la ruta que decidas para premium
    image: "/banners/banner-premium.png",
    color: "from-amber-900/90 to-amber-900/40",
  },
  {
    id: "mayoristas",
    title: "Ventas Mayoristas",
    subtitle: "Compra por volumen y maximiza las ganancias de tu negocio.",
    cta: "Explorar mayoristas",
    href: "/mayoristas", // Ajusta a tu ruta real
    image: "/banners/banner-mayorista.png",
    color: "from-emerald-900/90 to-emerald-900/40",
  },
];

export default function HeroCarousel() {
  // Configuramos Embla con Autoplay (pasa cada 5 segundos)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Esta función actualiza los puntitos (dots) cuando cambia el slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
      {/* Contenedor principal de Embla */}
      <div className="overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {BANNERS.map((banner) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 aspect-[16/9] md:aspect-[21/7]"
            >
              {/* Imagen de fondo */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Capa de degradado oscuro para que resalte el texto */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.color}`} />

              {/* Contenido del Banner */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-sm md:text-lg text-gray-200 mb-6 max-w-md drop-shadow">
                  {banner.subtitle}
                </p>
                <Link
                  href={banner.href}
                  className="inline-flex items-center w-fit px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-md"
                >
                  {banner.cta}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores (Dots) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-6" // El dot activo es más ancho (estilo Apple)
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}