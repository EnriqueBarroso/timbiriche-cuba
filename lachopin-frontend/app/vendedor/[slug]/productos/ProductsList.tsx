"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, PackageOpen, Pencil, Images } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ApiProduct } from "@/lib/api";
import AvailabilityToggle from "./AvailabilityToggle";
import DeleteProductButton from "./DeleteProductButton";

const TERRACOTTA = "#B84C24";

// Mismas categorías ya usadas en app/vendedor/[slug]/productos/nuevo/NewProductForm.tsx,
// solo para mostrar una etiqueta legible en los chips. Los negocios tipo EATS usan
// categorías de texto libre (ej. "Entradas") que no están en esta lista — en ese
// caso se muestra el valor tal cual viene del producto.
const CATEGORY_LABELS: Record<string, string> = {
  cellphones: "Celulares y Tablets",
  vehicles: "Motos, Carros y Bicicletas",
  fashion: "Ropa y Calzado",
  appliances: "Electrodomésticos",
  home: "Hogar y Muebles",
  food: "Combos y Alimentos",
  parts: "Piezas y Accesorios",
  crafts: "Artesanía y Manufactura",
  others: "Otros",
  wholesale: "Venta Mayorista (B2B)",
};

function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category;
}

interface Props {
  products: ApiProduct[];
  slug: string;
}

export default function ProductsList({ products, slug }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Mismo patrón de filtrado que InventoryManager.tsx (/mis-publicaciones):
  // categorías únicas extraídas del catálogo real del negocio, con "Todos" por defecto.
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category || "Sin categoría")));
    return ["Todos", ...unique];
  }, [products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || (p.category || "Sin categoría") === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
            style={{ outlineColor: TERRACOTTA }}
          />
        </div>
      </div>

      {categories.length > 2 && (
        <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat
                  ? "text-white shadow-md"
                  : "bg-white text-gray-400 border border-black/10"
              }`}
              style={activeCategory === cat ? { backgroundColor: TERRACOTTA } : undefined}
            >
              {cat === "Todos" ? "Todos" : categoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      <div className="px-5">
        <p className="text-xs text-gray-400 font-semibold mb-3">
          {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>

        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-black/10">
            <PackageOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-800">
              {products.length === 0 ? "Aún no tienes productos." : "No se encontraron productos."}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {products.length === 0
                ? "Usa el botón de arriba para publicar el primero."
                : "Prueba con otra búsqueda o categoría."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} slug={slug} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ProductRow({ product, slug }: { product: ApiProduct; slug: string }) {
  const image = product.images?.[0]?.url || null;
  const extraImages = (product.images?.length || 0) - 1;

  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-3 flex gap-3">
      <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] text-center px-1">
            Sin foto
          </div>
        )}
        {extraImages > 0 && (
          <span className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-black/60 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            <Images size={10} /> +{extraImages}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-sm" style={{ color: TERRACOTTA }}>
            {formatPrice(product.price, product.currency)}
          </span>
          {!product.isActive ? (
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Inactivo
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <AvailabilityToggle productId={product.id} initialIsSold={product.isSold} />
        <Link
          href={`/vendedor/${slug}/productos/${product.id}/editar`}
          className="self-center shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-black/10 text-gray-500 hover:text-white hover:bg-[#B84C24] hover:border-[#B84C24] transition-colors"
          aria-label={`Editar ${product.title}`}
        >
          <Pencil size={15} />
        </Link>
        <DeleteProductButton productId={product.id} productTitle={product.title} />
      </div>
    </div>
  );
}
