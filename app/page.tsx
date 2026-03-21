import { getProducts, getPromotedProducts, getFeaturedSellers } from "@/lib/actions";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import type { Metadata } from "next";
import { UtensilsCrossed, ChevronRight } from "lucide-react";
import {
  Smartphone,
  Shirt,
  Palette,
  Wrench,
  Pizza,
  LayoutGrid,
  Search,
  Car,
  Tv,
  Sofa,
  Package,
  Zap
} from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel"

// 👇 AQUÍ ESTÁ LA MAGIA: Las categorías exactas de la base de datos
const CATEGORIES = [
  {
    name: "Todo",
    slug: "",
    icon: LayoutGrid,
    color: "bg-gray-100 text-gray-800"
  },
  {
    name: "Celulares",
    slug: "cellphones",
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "Vehículos",
    slug: "vehicles",
    icon: Car,
    color: "bg-red-100 text-red-600"
  },
  {
    name: "Hogar",
    slug: "home",
    icon: Sofa,
    color: "bg-amber-100 text-amber-600"
  },
  {
    name: "Electro",
    slug: "appliances",
    icon: Tv,
    color: "bg-teal-100 text-teal-600"
  },
  {
    name: "Ropa",
    slug: "fashion",
    icon: Shirt,
    color: "bg-pink-100 text-pink-600"
  },
  {
    name: "Alimentos",
    slug: "food",
    icon: Pizza,
    color: "bg-orange-100 text-orange-600"
  },
  {
    name: "Piezas",
    slug: "parts",
    icon: Wrench,
    color: "bg-slate-100 text-slate-700"
  },
  {
    name: "Artesanía",
    slug: "crafts",
    icon: Palette,
    color: "bg-purple-100 text-purple-600"
  },
  {
    name: "Otros",
    slug: "others",
    icon: Package,
    color: "bg-gray-200 text-gray-700"
  },
];

export const metadata: Metadata = {
  title: {
    absolute: "LaChopin | Tu Mercado Online en Cuba",
  },
  description:
    "La forma más fácil de comprar y vender en Cuba. Ropa, celulares, electrodomésticos y más. Conecta directamente con vendedores verificados.",
  alternates: {
    canonical: "https://www.lachopin.com",
  },
  openGraph: {
    title: "LaChopin | Tu Mercado Online en Cuba",
    description:
      "Descubre miles de productos cerca de ti en Cuba. Compra seguro, vende rápido.",
    url: "https://www.lachopin.com",
    siteName: "LaChopin",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "LaChopin - Tu Mercado Online en Cuba",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ search?: string; query?: string; category?: string; page?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { search, query, category, page } = await searchParams;

  const searchTerm = search || query || "";
  const currentPage = Number(page) || 1;

  // 👇 CAMBIO 1: Cargamos los productos normales Y los promocionados al mismo tiempo
  // 👇 Cargamos todo en paralelo para máxima velocidad
  const [productsData, promotedProducts, featuredSellers] = await Promise.all([
    getProducts({
      query: searchTerm,
      category: category,
      page: currentPage,
    }),
    getPromotedProducts(),
    getFeaturedSellers() // <-- Añadimos la nueva función aquí
  ]);

  const { products, total, totalPages } = productsData;

  const categoryName = CATEGORIES.find(c => c.slug === category)?.name || category;

  const pageTitle = category
    ? `Explorando: ${categoryName}`
    : searchTerm
      ? `Resultados para "${searchTerm}"`
      : "Novedades Recientes";

  const currentSearchParams: Record<string, string | undefined> = {
    ...(searchTerm && { query: searchTerm }),
    ...(category && { category }),
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50/50">

      {/* HERO SECTION */}
      <HeroCarousel />
      <div className="max-w-7xl mx-auto">

        {/* CARRUSEL DE CATEGORÍAS */}
        <div className="sticky top-[56px] md:top-[64px] z-30 bg-gray-50/95 backdrop-blur-md py-4 border-b border-gray-200/50 mb-6 transition-all">
          <div className="flex overflow-x-auto gap-4 px-4 pb-2 no-scrollbar snap-x items-start">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat.slug || (!category && !cat.slug);

              return (
                <Link
                  key={cat.name}
                  href={cat.slug ? `/?category=${cat.slug}` : "/"}
                  className="flex flex-col items-center gap-2 min-w-[72px] snap-center group select-none"
                >
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center 
                    transition-all duration-300 shadow-sm group-hover:scale-105 group-active:scale-95
                    border-[3px] 
                    ${isActive
                      ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                      : "border-white hover:border-blue-200"
                    }
                    ${cat.color}
                  `}>
                    <cat.icon size={26} strokeWidth={2.5} />
                  </div>

                  <span className={`text-[11px] font-bold tracking-wide transition-colors ${isActive ? "text-blue-700" : "text-gray-500 group-hover:text-blue-600"}`}>
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CARRUSEL DE CATEGORÍAS */}
        <div className="sticky top-[56px] md:top-[64px] z-30 bg-gray-50/95 backdrop-blur-md py-4 border-b border-gray-200/50 mb-6 transition-all">
         {/* ... tu código actual de categorías ... */}
        </div>

        {/* 🏪 NUEVO: TIENDAS DESTACADAS (Solo en la página principal) */}
      {/* 🏪 TIENDAS DESTACADAS DINÁMICAS */}
        {!searchTerm && !category && currentPage === 1 && featuredSellers.length > 0 && (
          <div className="mb-8 px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Tiendas Destacadas</h2>
              <Link href="/tiendas" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                Ver todas
              </Link>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {featuredSellers.map((seller) => (
                <Link 
                  key={seller.id} 
                  href={`/vendedor/${seller.slug}`} 
                  className="min-w-[280px] snap-start bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-50 overflow-hidden shrink-0 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                     {/* Usamos una imagen por defecto de ui-avatars si el vendedor no ha subido foto */}
                     <img 
                       src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=random&color=fff`} 
                       alt={seller.storeName} 
                       className="w-full h-full object-cover" 
                     />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {seller.storeName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
                      {seller._count.products} {seller._count.products === 1 ? 'Producto' : 'Productos'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* 👑 SECCIÓN VIP: ANUNCIOS PREMIUM */}

        {/* 👑 SECCIÓN VIP: ANUNCIOS PREMIUM (Controlada por el Admin) */}
        {!searchTerm && !category && currentPage === 1 && promotedProducts.length > 0 && (
          <div className="mb-8 bg-gradient-to-b from-amber-50/50 to-transparent pt-4 pb-2 rounded-t-3xl border-t border-amber-100/50">
            <div className="px-4 mb-4 flex items-center gap-2">
              <div className="bg-gradient-to-tr from-amber-400 to-yellow-300 p-1.5 rounded-lg shadow-sm">
                <span className="text-lg">👑</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 uppercase tracking-tight">
                Anuncios Premium
              </h2>
            </div>
            {/* Carrusel horizontal de productos premium */}
            <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {promotedProducts.map((product: any) => (
                <div key={product.id} className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN VIP: LaChopin Eats */}
        <div className="max-w-6xl mx-auto px-4 my-8">
          <Link
            href="/eats"
            className="relative block w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
          >
            {/* Fondo con gradiente jugoso */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-rose-600"></div>

            {/* Contenido del Banner */}
            <div className="relative p-6 sm:p-8 flex items-center justify-between z-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-sm">
                  <UtensilsCrossed className="text-white w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    LaChopin <span className="bg-white text-red-600 px-2 py-0.5 rounded-md text-xl sm:text-2xl">Eats</span>
                  </h2>
                  <p className="text-red-50 text-sm sm:text-base mt-1 font-medium">
                    Pide comida a los mejores restaurantes por WhatsApp
                  </p>
                </div>
              </div>

              {/* Flecha indicadora */}
              <div className="hidden sm:flex bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:translate-x-2 transition-transform">
                <ChevronRight className="text-white" size={24} />
              </div>
            </div>
          </Link>
        </div>

        {/* RESULTADOS */}
        <div className="px-4 mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {pageTitle}
          </h2>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {total} productos
          </span>
        </div>

        <div className="px-4">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={currentSearchParams}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No hay productos aquí</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                {searchTerm
                  ? `No encontramos nada con "${searchTerm}".`
                  : `Sé el primero en publicar en la categoría ${categoryName}.`
                }
              </p>
              <Link href="/vender" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Publicar Ahora
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}