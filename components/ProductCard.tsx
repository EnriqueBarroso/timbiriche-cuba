"use client";

import { MessageCircle, Ban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { toast } from "sonner";
import { formatPrice, BLUR_PLACEHOLDER } from "@/lib/utils";

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0]?.url || "/placeholder.png";

  const title = product.title || "Producto sin nombre";
  const price = product.price || 0;

  const displayPrice = formatPrice(price, product.currency);

  const currency = product.currency || "USD";
  const sellerName = product.seller?.storeName || product.seller?.name || "Vendedor";
  const sellerPhone = product.seller?.phoneNumber || "";
  let cleanPhone = sellerPhone.replace(/\D/g, '');

  if (cleanPhone.length === 8) {
    cleanPhone = `53${cleanPhone}`;
  }
  const hasValidPhone = cleanPhone.length >= 8;
  const isSold = product.isSold || false;

  const favoriteData = {
    id: product.id,
    title: title,
    price: price,
    image: mainImage,
    currency: currency,
    seller: product.seller
  };

  const whatsappMessage = `Hola, vi tu anuncio en LaChopin: *${title}*. ¿Sigue disponible?`;
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
      <div className={`relative aspect-square overflow-hidden bg-gray-100 ${isSold ? "grayscale opacity-80" : ""}`}>
        <Link href={`/product/${product.id}`} className="block h-full w-full relative">
          <Image
            src={mainImage}
            alt={title}
            fill
            /* 👇 AJUSTE CLAVE PARA VELOCIDAD: 
               Le decimos a Next.js exactamente qué tamaño generar según la pantalla.
               Esto evita que descargue una imagen de 2000px en un móvil de 300px. */
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            // No usamos priority=true a menos que sea la imagen principal del Hero, para no bloquear la carga inicial.
            priority={false}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            // 👇 OPTIMIZACIÓN CLAVE: Calidad ligeramente reducida para portadas (ahorra mucho peso, apenas se nota)
            quality={75} 
          />
        </Link>

        {/* Cartel de VENDIDO */}
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
          <h3 className={`mb-2 line-clamp-2 text-[13px] md:text-sm font-semibold leading-snug min-h-[2.6em] transition-colors ${isSold ? "text-gray-400" : "text-gray-800 hover:text-blue-600"}`}>
            {title}
          </h3>
        </Link>

       {/* Precio Inteligente */}
        <div className="mb-3 flex items-center min-h-[32px]">
          {price === 0 ? (
            <span className={`text-xs md:text-sm font-black px-3 py-1.5 rounded-lg border shadow-sm ${
              isSold 
                ? "bg-gray-50 text-gray-400 border-gray-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              🏷️ Varios Precios
            </span>
          ) : (
            <span className={`text-xl md:text-2xl font-bold ${
              isSold ? "text-gray-400 line-through decoration-gray-400" : "text-gray-900"
            }`}>
              {displayPrice}
            </span>
          )}
        </div>

       {/* Vendedor (AHORA CLIQUEABLE) */}
        {product.sellerId ? (
          <Link href={`/vendedor/${product.sellerId}`} className="flex items-center gap-2 mb-3 transition-colors md:mb-4 hover:text-blue-600 group">
            <div className="relative overflow-hidden bg-gray-100 rounded-full shrink-0 h-6 w-6">
              <div className="flex items-center justify-center w-full h-full text-[10px] font-bold text-blue-600 bg-blue-100 group-hover:bg-blue-200">
                {sellerName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-xs text-gray-500 truncate group-hover:text-blue-600">{sellerName}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="relative overflow-hidden bg-gray-100 rounded-full shrink-0 h-6 w-6">
              <div className="flex items-center justify-center w-full h-full text-[10px] font-bold text-gray-400 bg-gray-100">
                {sellerName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-xs text-gray-400 truncate">{sellerName}</span>
          </div>
        )}

        {/* Botón de Contacto */}
        <div className="mt-auto">
          {isSold ? (
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-400 text-[13px] md:text-sm font-semibold cursor-not-allowed py-3 md:py-2.5"
            >
              <Ban size={16} />
              <span>No disponible</span>
            </button>
          ) : hasValidPhone ? (
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