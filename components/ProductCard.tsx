"use client";

import { MessageCircle, Ban } from "lucide-react"; // 👈 Añadí el icono 'Ban' para cuando está vendido
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { toast } from "sonner";

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0]?.url || "/placeholder.png";

  const title = product.title || "Producto sin nombre";
  const price = product.price || 0;
  
  // Si llega 65000 -> Muestra 650
  const displayPrice = price / 100;  

  const currency = product.currency || "USD";
  const sellerName = product.seller?.storeName || product.seller?.name || "Vendedor";
  const sellerPhone = product.seller?.phoneNumber || "";
  const cleanPhone = sellerPhone.replace(/\D/g, ''); 
  const hasValidPhone = cleanPhone.length >= 8; 

  // 👇 NUEVO: Sacamos el estado de vendido
  const isSold = product.isSold || false;

  const favoriteData = {
    id: product.id,
    title: title,
    price: price, 
    image: mainImage,
    currency: currency,
    seller: product.seller
  };

  const whatsappMessage = `Hola, vi tu anuncio en Timbiriche: *${title}*. ¿Sigue disponible?`;
  const whatsappLink = hasValidPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const handleContactClick = (e: React.MouseEvent) => {
    if (!sellerPhone) {
      e.preventDefault();
      toast.error("Este vendedor no tiene WhatsApp configurado");
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">

      {/* Imagen del Producto */}
      {/* 👇 NUEVO: Si está vendido, ponemos la imagen en blanco y negro (grayscale) */}
      <div className={`relative aspect-square overflow-hidden bg-gray-100 ${isSold ? "grayscale opacity-80" : ""}`}>
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* 👇 NUEVO: Cartel de AGOTADO encima de la foto */}
        {isSold && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 text-white px-4 py-1 rounded-full font-bold text-sm -rotate-12 border-2 border-white shadow-xl pointer-events-none">
            VENDIDO
          </div>
        )}

        {/* Botón de Favoritos */}
        <div className="absolute right-2 top-2 md:right-3 md:top-3 z-10">
          <FavoriteButton product={favoriteData} />
        </div>
      </div>

      {/* Contenido de la Card */}
      <div className="flex flex-1 flex-col p-3 md:p-4">

        {/* Título */}
        <Link href={`/product/${product.id}`}>
          {/* 👇 NUEVO: Si está vendido, el texto se ve gris */}
          <h3 className={`mb-2 line-clamp-2 text-[13px] md:text-sm font-semibold leading-snug min-h-[2.6em] transition-colors ${isSold ? "text-gray-400" : "text-gray-800 hover:text-blue-600"}`}>
            {title}
          </h3>
        </Link>

        {/* Precio */}
        <div className="mb-3 flex items-baseline gap-1">
          {/* 👇 NUEVO: Si está vendido, tachamos el precio */}
          <span className={`text-xl md:text-2xl font-bold ${isSold ? "text-gray-400 line-through decoration-gray-400" : "text-gray-900"}`}>
            ${displayPrice} 
          </span>
          <span className="text-xs font-medium text-gray-500">{currency}</span>
        </div>

        {/* Vendedor */}
        <div className="mb-3 md:mb-4 flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-100 shrink-0">
            <div className="flex h-full w-full items-center justify-center bg-blue-100 text-[10px] font-bold text-blue-600">
              {sellerName.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="truncate text-xs text-gray-500">{sellerName}</span>
        </div>

        {/* Botón de Contacto */}
        <div className="mt-auto">
          {/* 👇 LÓGICA PRINCIPAL: */}
          {isSold ? (
            // CASO 1: Está vendido -> Botón deshabilitado gris
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-400 text-[13px] md:text-sm font-semibold cursor-not-allowed py-3 md:py-2.5"
            >
              <Ban size={16} />
              <span>No disponible</span>
            </button>
          ) : hasValidPhone ? (
            // CASO 2: Disponible y con WhatsApp -> Botón Verde (El tuyo original)
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-[#25D366] py-3 md:py-2.5 text-[13px] md:text-sm font-semibold text-white transition-all hover:bg-[#20bd5a] active:scale-95 shadow-sm"
            >
              <MessageCircle size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
              <span>Contactar</span>
            </a>
          ) : (
            // CASO 3: Disponible pero sin WhatsApp -> Botón gris (El tuyo original)
            <button
              onClick={handleContactClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-400 text-[13px] md:text-sm font-semibold cursor-not-allowed py-3 md:py-2.5"
            >
              Sin WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}