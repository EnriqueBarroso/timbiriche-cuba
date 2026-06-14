"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// 📝 Datos de tus banners
const BANNERS = [
  {
    id: "captacion",
    title: "Vende con nosotros",
    subtitle: "Digitaliza tu catálogo gratis y recibe pedidos por WhatsApp.",
    cta: "Crear mi tienda",
    href: "/vender",
    image: "/banners/banner-b2b.webp",
  },
  {
    id: "premium",
    title: "Ofertas Premium",
    subtitle: "Descubre los productos más destacados.", // Acorté ligeramente para móvil
    cta: "Ver ofertas",
    href: "/premium",
    image: "/banners/banner-premium.webp",
  },
  {
    id: "mayoristas",
    title: "Ventas Mayoristas",
    subtitle: "Compra por volumen y maximiza las ganancias de tu negocio.",
    cta: "Explorar", // Acorté ligeramente el CTA para móvil
    href: "/mayoristas",
    image: "/banners/banner-mayorista.webp",
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
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-lg" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 min-h-[450px] md:min-h-[500px] aspect-[16/7]"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                style={{ objectFit: 'cover' }}
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/5 to-transparent" />

              {/* Texto superpuesto, inferior izquierda */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-8 md:p-12 z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-md leading-tight max-w-lg">
                  {banner.title}
                </h2>

                <p className="text-sm md:text-base text-white/80 mb-5 md:mb-6 max-w-sm md:max-w-md drop-shadow">
                  {banner.subtitle}
                </p>

                <Button asChild variant="default" className="w-fit">
                  <Link href={banner.href}>
                    {banner.cta}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flecha siguiente + dots, esquina inferior derecha */}
      <div className="absolute bottom-5 md:bottom-8 right-5 md:right-8 flex items-center gap-3 z-20">
        <div className="flex items-center gap-1.5">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-white w-5 h-1.5 md:w-6 md:h-2"
                  : "bg-white/50 hover:bg-white/70 w-1.5 h-1.5 md:w-2 md:h-2"
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          aria-label="Siguiente diapositiva"
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </motion.div>
  );
}