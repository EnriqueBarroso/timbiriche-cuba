"use client";

import { MessageCircle, Ban, Zap, Wallet, Utensils, MapPin, BadgeCheck, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { toast } from "sonner";
import { formatPrice, BLUR_PLACEHOLDER, optimizeImage } from "@/lib/utils";

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

// Convierte una fecha a texto relativo: "hace 2 días", "hace 3 horas", etc.
function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "ahora mismo";
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`;
  return `hace ${Math.floor(diffDays / 30)} mes`;
}

export function ProductCard({ product }: ProductCardProps) {
  const rawImageUrl = product.images?.[0]?.url;
  const hasValidImage =
    typeof rawImageUrl === "string" &&
    (rawImageUrl.startsWith("http") || rawImageUrl.startsWith("/"));

  const mainImage = hasValidImage ? rawImageUrl : "/placeholder.png";

  const title = product.title || "Producto sin nombre";
  const price = product.price || 0;
  const displayPrice = formatPrice(price, product.currency);
  const currency = product.currency || "USD";

  const seller = product.seller;
  const sellerName = seller?.storeName || seller?.name || "Vendedor";
  const sellerPhone = seller?.phoneNumber || "";
  const isVerified = seller?.isVerified || false;
  const isRestaurant = seller?.isRestaurant || false;
  const sellerAddress = seller?.address || "";

  let cleanPhone = sellerPhone.replace(/\D/g, "");
  if (cleanPhone.length === 8) cleanPhone = `53${cleanPhone}`;
  const hasValidPhone = cleanPhone.length >= 8;

  const isSold = product.isSold || false;
  const isFlashOffer = product.isFlashOffer || false;
  const acceptsZelle = seller?.acceptsZelle || false;
  const createdAt = product.createdAt;

  const favoriteData = {
    id: product.id,
    title,
    price,
    image: mainImage,
    currency,
    seller,
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

      {/* ── IMAGEN ─────────────────────────────────────────── */}
      <div className={`relative aspect-square overflow-hidden bg-gray-50 ${isSold ? "grayscale opacity-80" : ""}`}>
        <Link href={`/product/${product.id}`} className="block h-full w-full relative">
          {hasValidImage ? (
            <Image
              src={optimizeImage(rawImageUrl, 400)}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              quality={75}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-300 transition-transform duration-500 group-hover:scale-105">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                <Utensils className="w-8 h-8 text-gray-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sin Foto</span>
            </div>
          )}
        </Link>

        {/* Badge Oferta Flash */}
        {!isSold && isFlashOffer && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20">
            <span className="flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-md text-[10px] md:text-xs font-black tracking-wide shadow-md uppercase">
              <Zap size={12} className="fill-white" />
              Oferta Flash
            </span>
          </div>
        )}

        {/* Badge Zelle */}
        {!isSold && acceptsZelle && (
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 z-20">
            <span className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded-md text-[10px] md:text-xs font-black tracking-wide shadow-md uppercase">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Zelle
            </span>
          </div>
        )}

        {/* Cartel VENDIDO */}
        {isSold && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 text-white px-4 py-1 rounded-full font-bold text-sm -rotate-12 border-2 border-white shadow-xl pointer-events-none">
            VENDIDO
          </div>
        )}

        {/* Timestamp flotante — esquina inferior derecha */}
        {createdAt && !isSold && (
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-20">
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium">
              <Clock size={9} />
              {timeAgo(createdAt)}
            </span>
          </div>
        )}

        {/* Botón Favoritos */}
        <div className="absolute right-2 top-2 md:right-3 md:top-3 z-10">
          <FavoriteButton product={favoriteData} />
        </div>
      </div>

      {/* ── CONTENIDO ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-3 md:p-4">

        {/* Título */}
        <Link href={`/product/${product.id}`}>
          <h3 className={`mb-2 line-clamp-2 text-[13px] md:text-sm font-semibold leading-snug min-h-[2.6em] transition-colors ${isSold ? "text-gray-400" : "text-gray-800 hover:text-blue-600"}`}>
            {title}
          </h3>
        </Link>

        {/* Precio */}
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
            <span className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${
              isSold ? "text-gray-400 line-through decoration-gray-400" : "text-gray-900"
            }`}>
              {displayPrice}
              {!isSold && isFlashOffer && (
                <span className="text-[10px] md:text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  Rebajado
                </span>
              )}
            </span>
          )}
        </div>

        {/* ── VENDEDOR ───────────────────────────────────────
            Bloque enriquecido: avatar · nombre · verificado · dirección
        ──────────────────────────────────────────────────── */}
        {product.sellerId ? (
          <Link
            href={`/vendedor/${seller?.slug || product.sellerId}`}
            className="flex items-start gap-2 mb-3 md:mb-3 transition-colors hover:text-blue-600 group/seller"
          >
            {/* Avatar */}
            <div className="shrink-0 h-7 w-7 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center group-hover/seller:bg-blue-200 transition-colors">
              {seller?.avatar ? (
                <Image
                  src={seller.avatar}
                  alt={sellerName}
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-[11px] font-bold text-blue-600">
                  {sellerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Nombre + badges + dirección */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-gray-700 font-medium truncate group-hover/seller:text-blue-600 max-w-[120px]">
                  {sellerName}
                </span>

                {/* Badge Verificado */}
                {isVerified && (
                  <span title="Vendedor verificado">
                    <BadgeCheck size={13} className="text-blue-500 shrink-0" />
                  </span>
                )}

                {/* Badge Restaurante */}
                {isRestaurant && (
                  <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-200 shrink-0">
                    Restaurante
                  </span>
                )}

                {/* Badge Zelle en nombre */}
                {acceptsZelle && (
                  <Wallet size={11} className="text-purple-500 shrink-0" />
                )}
              </div>

              {/* Dirección */}
              {sellerAddress && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5 truncate">
                  <MapPin size={9} className="shrink-0" />
                  {sellerAddress}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-gray-400">
                {sellerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-gray-400 truncate">{sellerName}</span>
          </div>
        )}

        {/* ── BOTÓN CONTACTO ─────────────────────────────── */}
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
              onClick={handleContactClick}
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