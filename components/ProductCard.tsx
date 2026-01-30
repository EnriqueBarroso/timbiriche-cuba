"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
// 👇 Importamos el componente botón
import FavoriteButton from "@/components/FavoriteButton"; 

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  // --- LÓGICA DE IMAGEN ---
  const getValidImage = (img: any) => {
    if (!img) return "/placeholder.jpg";
    if (typeof img !== "string") return "/placeholder.jpg";
    if (img.trim() === "") return "/placeholder.jpg";
    return img;
  };

  const rawImage = product.images?.[0] || product.image;
  const mainImage = getValidImage(rawImage);

  // --- DATOS SEGUROS ---
  const title = product.title || "Producto sin nombre";
  const price = product.price || 0;
  const currency = product.currency || "USD";
  const sellerName = product.seller?.name || "Vendedor Timbiriche";
  const sellerPhone = product.seller?.phone || "5300000000";

  // --- OBJETO PARA FAVORITOS ---
  // Creamos un paquete limpio con los datos para el botón
  const favoriteData = {
    id: product.id,
    title: title,
    price: price,
    image: mainImage,
    currency: currency,
    seller: product.seller
  };

  // Link WhatsApp
  const whatsappMessage = `Hola, vi tu anuncio en Timbiriche: *${title}* (${price} ${currency}). ¿Sigue disponible?`;
  const whatsappLink = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  // Acción Carrito
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id, title, price, image: mainImage, quantity: 1, currency
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
      
      {/* IMAGEN */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </Link>
        
        {/* 👇 AQUÍ USAMOS EL BOTÓN NUEVO */}
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton product={favoriteData} />
        </div>
      </div>

      {/* DETALLES */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`}>
            <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-snug text-gray-700 h-[2.5em] hover:text-blue-600 transition-colors">
            {title}
            </h3>
        </Link>

        <div className="mb-3 flex items-baseline gap-1">
            <span className="text-xs font-medium text-gray-500 relative top-1">$</span>
            <span className="text-xl font-bold text-gray-900">{price.toLocaleString()}</span>
            <span className="text-xs font-medium text-gray-500">{currency}</span>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-100">
            {product.seller?.avatar ? (
               <Image src={product.seller.avatar} alt={sellerName} fill className="object-cover" />
            ) : (
               <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[10px] font-bold text-gray-500">
                 {sellerName.charAt(0).toUpperCase()}
               </div>
            )}
          </div>
          <span className="truncate text-xs text-gray-500">{sellerName}</span>
        </div>

        {/* BOTONES */}
        <div className="mt-auto flex gap-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a] active:scale-95 shadow-sm"
          >
            <MessageCircle size={18} />
            <span className="truncate">Chat</span>
          </a>

          <button
            onClick={handleAddToCart}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 active:scale-95 border border-blue-100"
            title="Añadir al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}