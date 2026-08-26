"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, ShoppingBag, MessageCircle, ArrowLeft, Images } from "lucide-react";
import type { ApiBusiness, ProductInBusiness } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";

// Los productos de tipo EATS usan texto libre en español ("Entradas",
// "Postres"...) como categoría, así que se muestran tal cual. Los de tipo
// MARKETPLACE usan los ids de lib/categories.ts (ej. "home"), pensados para
// el filtro general del sitio, no para mostrarse — los traducimos a su
// shortLabel ("Hogar") sin tocar el dato subyacente.
const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.shortLabel]),
);

function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category;
}

// Paleta cálida (terracota + crema) para la tienda pública.
const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function whatsappLink(phoneNumber: string, message: string) {
  const phone = cleanPhone(phoneNumber || "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function businessTypeLabel(business: ApiBusiness) {
  if (business.isRestaurant) return "Paladar";
  if (business.isWholesale) return "Mayorista";
  return "Tienda";
}

interface BusinessStorefrontProps {
  business: ApiBusiness;
}

export default function BusinessStorefront({ business }: BusinessStorefrontProps) {
  const groupedProducts = useMemo(() => {
    const groups: Record<string, ProductInBusiness[]> = {};
    for (const product of business.products) {
      const category = product.category || "Otros";
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    }
    return groups;
  }, [business.products]);

  const categories = useMemo(() => Object.keys(groupedProducts), [groupedProducts]);
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const currentCategory = groupedProducts[activeCategory] ? activeCategory : categories[0] || "";
  const activeProducts = groupedProducts[currentCategory] || [];

  const coverImage =
    business.coverImage || business.products[0]?.images[0]?.url || null;
  const avatar =
    business.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(business.storeName)}&background=B84C24&color=fff`;

  const schedule =
    business.openTime && business.closeTime
      ? `${business.openTime} – ${business.closeTime}`
      : null;

  const contactMessage = `¡Hola! Vi "${business.storeName}" en LaChopin y quisiera más información.`;

  return (
    <main className="min-h-screen flex justify-center font-sans" style={{ backgroundColor: CREAM }}>
      <div className="w-full max-w-md relative pb-10" style={{ backgroundColor: CREAM }}>
        {/* HERO */}
        <section className="relative h-64 w-full overflow-hidden bg-neutral-900">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Portada de ${business.storeName}`}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          <div className="absolute top-4 left-4 z-10">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all border border-white/20"
            >
              <ArrowLeft size={20} />
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={avatar}
                alt={`Logo de ${business.storeName}`}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/80 shadow"
              />
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                {businessTypeLabel(business)}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight mb-1.5">
              {business.storeName}
            </h1>
            {business.address && (
              <p className="flex items-center gap-1 text-sm text-white/80 mb-2">
                <MapPin size={14} /> {business.address}
              </p>
            )}
            {business.description && (
              <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
                {business.description}
              </p>
            )}
          </div>
        </section>

        {/* CTA WHATSAPP */}
        <div className="px-5 mt-4">
          <a
            href={whatsappLink(business.phoneNumber, contactMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-black text-base shadow-lg shadow-green-900/10 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <MessageCircle size={20} /> Contactar por WhatsApp
          </a>
        </div>

        {/* STATS DE CONFIANZA (datos reales, sin cifras inventadas) */}
        <div className="px-5 mt-3 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-black/5 p-4 text-center shadow-sm">
            <p className="text-lg font-black" style={{ color: TERRACOTTA }}>
              {business._count.products}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
              {business._count.products === 1 ? "producto" : "productos"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-4 text-center shadow-sm">
            <p className="text-lg font-black" style={{ color: TERRACOTTA }}>
              {schedule || "Bajo pedido"}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
              {schedule ? "horario" : "disponibilidad"}
            </p>
          </div>
        </div>

        {/* CHIPS DE CATEGORÍA — sticky solo si hay más de una */}
        {categories.length > 1 && (
          <div
            className="sticky top-20 md:top-24 z-30 mt-6 py-3 border-b border-black/5"
            style={{ backgroundColor: `${CREAM}F2` /* ~95% opacidad, sin backdrop-hack raro */ }}
          >
            <div className="flex overflow-x-auto gap-2 px-5 [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 text-[13px] font-bold rounded-full transition-all shrink-0 ${
                    currentCategory === category
                      ? "text-white shadow-sm"
                      : "bg-white text-gray-600 border border-black/10"
                  }`}
                  style={currentCategory === category ? { backgroundColor: TERRACOTTA } : undefined}
                >
                  {categoryLabel(category)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTOS DE LA CATEGORÍA ACTIVA */}
        <section className="px-5 py-6">
          {activeProducts.length > 0 ? (
            <>
              <h2 className="text-lg font-black text-gray-900 mb-4">{categoryLabel(currentCategory)}</h2>
              <div className="flex flex-col gap-4">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} business={business} />
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-black/10">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="font-bold text-gray-800">Aún no hay productos publicados.</p>
              <p className="text-xs text-gray-400 mt-1">Vuelve pronto para ver el catálogo completo.</p>
            </div>
          )}
        </section>

        {/* SOBRE NOSOTROS */}
        <div className="mx-5 mt-2 mb-6 rounded-3xl bg-neutral-900 text-white p-6">
          <h3 className="font-black text-base mb-2">Sobre nosotros</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {business.description || `${business.storeName} está en LaChopin, la plataforma de negocios cubanos.`}
          </p>
          <div className="space-y-2 text-sm text-white/80">
            {schedule && (
              <p className="flex items-center gap-2">
                <Clock size={14} /> {schedule}
              </p>
            )}
            {business.address && (
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {business.address}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 px-5">
          {business.storeName}
          {business.address ? ` · ${business.address}` : ""}
        </p>
      </div>
    </main>
  );
}

function ProductCard({
  product,
  business,
}: {
  product: ProductInBusiness;
  business: ApiBusiness;
}) {
  const image = product.images[0]?.url || null;
  const extraImages = product.images.length - 1;
  const orderMessage = `¡Hola! Quisiera pedir: *${product.title}* (${formatPrice(
    product.price,
    product.currency,
  )})\n\n*Negocio:* ${business.storeName}`;

  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        {image ? (
          <img src={image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            Sin foto
          </div>
        )}
        {extraImages > 0 && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-full">
            <Images size={11} /> +{extraImages}
          </span>
        )}
      </div>

      {/* flex-col + gap: la altura crece con el contenido real, el nombre a
          2 líneas nunca pisa la descripción de abajo. */}
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-gray-900 leading-snug">{product.title}</h3>
          <span className="shrink-0 font-black" style={{ color: TERRACOTTA }}>
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        {product.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
        )}
        <a
          href={whatsappLink(business.phoneNumber, orderMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-green-100 transition-colors active:scale-95"
        >
          <MessageCircle size={13} /> Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}
