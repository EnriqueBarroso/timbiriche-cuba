"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// 📝 Datos de tus banners
const BANNERS = [
  {
    id: "captacion",
    title: "Vende con nosotros",
    subtitle: "Digitaliza tu catálogo gratis y recibe pedidos por WhatsApp.",
    cta: "Crear mi tienda",
    href: "/vender",
    image: "/banners/banner-b2b.jpg", 
    color: "from-blue-900/90 to-blue-900/40",
  },
  {
    id: "premium",
    title: "Ofertas Premium",
    subtitle: "Descubre los productos más destacados.", // Acorté ligeramente para móvil
    cta: "Ver ofertas",
    href: "/premium",
    image: "/banners/banner-premium.png",
    color: "from-amber-900/90 to-amber-900/40",
  },
  {
    id: "mayoristas",
    title: "Ventas Mayoristas",
    subtitle: "Compra por volumen y maximiza las ganancias de tu negocio.",
    cta: "Explorar", // Acorté ligeramente el CTA para móvil
    href: "/mayoristas",
    image: "/banners/banner-mayorista.png",
    color: "from-emerald-900/90 to-emerald-900/40",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

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
    // Reduje mb-8 a mb-6 para dar más aire general en móvil
    <div className="relative w-full max-w-7xl mx-auto mb-6 md:mb-8 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/7]" // Hice el aspecto móvil ligeramente más alto [16/10] para dar aire
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.color}`} />

              {/* 👇 AJUSTES DE CONTENIDO PARA MÓVIL 👇 */}
              <div className="absolute inset-0 flex flex-col justify-start pt-6 px-6 pb-12 md:pt-0 md:justify-center md:px-16 md:pb-0 z-10">
                {/* justify-start pt-6 px-6 pb-12 -> Móvil: Contenido arriba con padding top/bottom
                  md:pt-0 md:justify-center md:px-16 md:pb-0 -> Escritorio: Centrado vertical y padding lateral original
                */}
                
                <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-white mb-1.5 md:mb-4 drop-shadow-md leading-tight">
                  {/* Reduje text-3xl a text-2xl y mb-2 a mb-1.5 en móvil */}
                  {banner.title}
                </h2>
                
                <p className="text-sm md:text-lg text-gray-200 mb-4 md:mb-6 max-w-sm md:max-w-md drop-shadow">
                  {/* Reduje mb-6 a mb-4 y max-w en móvil */}
                  {banner.subtitle}
                </p>
                
                <Link
                  href={banner.href}
                  // Reduje padding y text size en móvil
                  className="inline-flex items-center w-fit px-4 py-2 md:px-5 md:py-2.5 bg-white text-gray-900 text-sm md:text-base font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-md"
                >
                  {banner.cta}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👇 AJUSTE DE DOTS PARA MÓVIL 👇 */}
      <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-1.5 md:gap-2 z-20">
        {/* Bajé bottom-4 a bottom-3 y gap-2 a gap-1.5 en móvil */}
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            // Dots ligeramente más pequeños en móvil (w-1.5 h-1.5)
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-5 md:w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}