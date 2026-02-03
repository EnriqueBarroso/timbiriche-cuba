"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton";
import { toast } from "sonner";

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  // ✅ CORREGIDO: Obtener imagen sin función auxiliar
  const mainImage = product.images?.[0]?.url || "/placeholder.png";
  
  const title = product.title || "Producto sin nombre";
  const price = product.price || 0;
  const displayPrice = price / 100;
  const currency = product.currency || "USD";
  const sellerName = product.seller?.storeName || product.seller?.name || "Vendedor";
  const sellerPhone = product.seller?.phoneNumber || "";

  const favoriteData = {
    id: product.id,
    title: title,
    price: price,
    image: mainImage,
    currency: currency,
    seller: product.seller
  };

  const whatsappMessage = `Hola, vi tu anuncio en Timbiriche: *${title}*. ¿Sigue disponible?`;
  const whatsappLink = sellerPhone 
    ? `https://wa.me/${sellerPhone.replace(/\D/g,'')}?text=${encodeURIComponent(whatsappMessage)}` 
    : "#";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({ 
      id: product.id, 
      title, 
      price, 
      image: mainImage, 
      quantity: 1, 
      currency 
    });

    toast.success("¡Producto añadido!", {
      duration: 2000,
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
      
      {/* Imagen del Producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
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
        
        {/* Botón de Favoritos */}
        <div className="absolute right-2 top-2 md:right-3 md:top-3 z-10">
          <FavoriteButton product={favoriteData} />
        </div>
      </div>

      {/* Contenido de la Card */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        
        {/* Título - Más grande en móvil */}
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 text-[13px] md:text-sm font-semibold leading-snug text-gray-800 min-h-[2.6em] hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Precio - Más prominente */}
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-gray-500">{currency}</span>
        </div>

        {/* Vendedor - Más compacto en móvil */}
        <div className="mb-3 md:mb-4 flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-100 shrink-0">
            <div className="flex h-full w-full items-center justify-center bg-blue-100 text-[10px] font-bold text-blue-600">
              {sellerName.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="truncate text-xs text-gray-500">{sellerName}</span>
        </div>

        {/* Botones de Acción - Optimizados para móvil */}
        <div className="mt-auto flex gap-2">
          {sellerPhone ? (
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-1 items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-[#25D366] py-3 md:py-2.5 text-[13px] md:text-sm font-semibold text-white transition-all hover:bg-[#20bd5a] active:scale-95 shadow-sm"
            >
              <MessageCircle size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
              <span className="truncate">Chat</span>
            </a>
          ) : (
            <button 
              disabled 
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-400 text-[13px] md:text-sm font-semibold cursor-not-allowed py-3 md:py-2.5"
            >
              Sin WhatsApp
            </button>
          )}

          <button 
            onClick={handleAddToCart} 
            className="flex h-11 w-11 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 active:scale-95 border border-blue-100" 
            title="Añadir al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}