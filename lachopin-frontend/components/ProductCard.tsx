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
  compact?: boolean;
}

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

export function ProductCard({ product, compact = false }: ProductCardProps) {
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

  const favoriteData = { id: product.id, title, price, image: mainImage, currency, seller };

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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1">

      {/* ── IMAGEN ─────────────────────────────────────────── */}
      <div className={`relative aspect-[3/4] overflow-hidden bg-gray-50 ${isSold ? "grayscale opacity-70" : ""}`}>
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          {hasValidImage ? (
            <Image
              src={optimizeImage(rawImageUrl, 400)}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              quality={75}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <Utensils className="w-7 h-7 text-gray-300" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-3">Sin Foto</span>
            </div>
          )}
        </Link>

        {/* Gradiente inferior para legibilidad de badges */}
        {!isSold && (
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        )}

        {/* Badge Flash — arriba izquierda */}
        {!isSold && isFlashOffer && (
          <div className="absolute top-2 left-2 z-20">
            <span className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase leading-none h-5">
              <Zap size={10} className="fill-white" /> Flash
            </span>
          </div>
        )}

        {/* Favoritos — arriba derecha */}
        <div className="absolute right-2 top-2 z-10">
          <FavoriteButton product={favoriteData} />
        </div>

        {/* Timestamp + Zelle — abajo izquierda, sobre el gradiente */}
        {!isSold && (
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5">
            {acceptsZelle && (
              <span className="flex items-center gap-1 bg-purple-600 text-white px-1.5 py-0.5 rounded-md text-[9px] font-black">
                <Wallet size={9} /> Z
              </span>
            )}
            {createdAt && (
              <span className="flex items-center gap-1 bg-black/40 text-white px-1.5 py-0.5 rounded-md text-[8px] font-medium">
                <Clock size={8} /> {timeAgo(createdAt)}
              </span>
            )}
          </div>
        )}

        {/* Cartel VENDIDO */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="bg-black/75 text-white px-5 py-1.5 rounded-full font-black text-sm -rotate-12 border-2 border-white/60 shadow-xl">
              VENDIDO
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENIDO ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-3">

        {/* Precio — primero, es el dato más decisivo */}
        <div className="mb-1.5">
          {price === 0 ? (
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              🏷️ Varios Precios
            </span>
          ) : (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`text-xl font-black leading-none ${isSold ? "text-gray-400 line-through" : "text-gray-900"}`}>
                {displayPrice}
              </span>
              {!isSold && isFlashOffer && (
                <span className="flex items-center text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-black uppercase leading-none h-5">
                  Rebajado
                </span>
              )}
            </div>
          )}
        </div>

        {/* Título */}
        <Link href={`/product/${product.id}`}>
          <h3 className={`line-clamp-2 min-h-[2.4em] text-[12px] font-semibold leading-[1.35] mb-2 break-words transition-colors ${
            isSold ? "text-gray-400" : "text-gray-700 hover:text-blue-600"
          }`}>
            {title}
          </h3>
        </Link>

        {/* Seller — oculto en modo compact */}
        {!compact && product.sellerId && (
          <Link
            href={`/vendedor/${seller?.slug || product.sellerId}`}
            className="flex items-center gap-1.5 mb-2.5 group/seller"
          >
            <div className="shrink-0 h-5 w-5 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center border border-blue-100">
              {seller?.avatar ? (
                <Image src={seller.avatar} alt={sellerName} width={20} height={20} className="object-cover w-full h-full" />
              ) : (
                <span className="text-[9px] font-black text-blue-600">{sellerName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] text-gray-500 font-medium truncate group-hover/seller:text-blue-600 transition-colors">
                {sellerName}
              </span>
              {isVerified && <BadgeCheck size={11} className="text-blue-500 shrink-0" />}
              {isRestaurant && (
                <span className="text-[8px] font-bold text-orange-500 bg-orange-50 px-1 rounded-full border border-orange-100 shrink-0">
                  Resto
                </span>
              )}
            </div>
            {sellerAddress && (
              <span className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400 truncate shrink-0">
                <MapPin size={8} className="shrink-0" />
                {sellerAddress.split(",")[0]}
              </span>
            )}
          </Link>
        )}

        {/* CTA */}
        <div className="mt-auto">
          {isSold ? (
            <button disabled className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed py-2.5">
              <Ban size={14} /> No disponible
            </button>
          ) : hasValidPhone ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleContactClick}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#20bd5a] active:scale-95 shadow-sm shadow-green-200"
            >
              <MessageCircle size={14} className="shrink-0" />
              Contactar
            </a>
          ) : (
            <button
              onClick={handleContactClick}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed py-2.5"
            >
              Sin WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
