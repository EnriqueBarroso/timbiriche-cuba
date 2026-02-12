import { getProducts } from "@/lib/actions";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { 
  Smartphone, 
  Shirt, 
  Palette, 
  Wrench, 
  Pizza, 
  LayoutGrid,
  Search
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Timbiriche Cuba | Compra y Vende Fácil en Cuba",
  },
  description:
    "Marketplace P2P para Cuba. Encuentra tecnología, ropa, combos, artesanía y más. Conecta directo con vendedores por WhatsApp. Sin intermediarios.",
  alternates: {
    canonical: "https://timbiriche-cuba.vercel.app",
  },
  openGraph: {
    title: "Timbiriche Cuba 🇨🇺 | Compra y Vende Fácil",
    description:
      "Descubre miles de productos cerca de ti en Cuba. Compra seguro, vende rápido.",
    url: "https://timbiriche-cuba.vercel.app",
    siteName: "Timbiriche Cuba",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Timbiriche Cuba - Marketplace",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

const CATEGORIES = [
  { 
    name: "Todo", 
    slug: "", 
    icon: LayoutGrid, 
    color: "bg-gray-100 text-gray-600" 
  },
  { 
    name: "Tecnología", 
    slug: "tech", 
    icon: Smartphone, 
    color: "bg-blue-100 text-blue-600" 
  },
  { 
    name: "Combos", 
    slug: "food", 
    icon: Pizza, 
    color: "bg-yellow-100 text-yellow-600" 
  },
  { 
    name: "Ropa", 
    slug: "fashion", 
    icon: Shirt, 
    color: "bg-pink-100 text-pink-600" 
  },
  { 
    name: "Artesanía", 
    slug: "crafts", 
    icon: Palette, 
    color: "bg-orange-100 text-orange-600" 
  },
  { 
    name: "Piezas", 
    slug: "parts", 
    icon: Wrench, 
    color: "bg-purple-100 text-purple-600" 
  },
];

export const dynamic = "force-dynamic";

interface Props {
  // 👇 ACEPTAMOS 'query' (del Navbar) Y 'search' (por si acaso)
  searchParams: Promise<{ search?: string; query?: string; category?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { search, query, category } = await searchParams;
  
  // Unificamos el término de búsqueda (priorizamos lo que venga)
  const searchTerm = search || query || "";
  
  const products = await getProducts({ 
    query: searchTerm, // Pasamos el texto del buscador
    category: category // Pasamos la categoría seleccionada
  });

  // Título bonito
  const categoryName = CATEGORIES.find(c => c.slug === category)?.name || category;

  const pageTitle = category 
    ? `Explorando: ${categoryName}`
    : searchTerm 
      ? `Resultados para "${searchTerm}"`
      : "Novedades Recientes";

  return (
    <div className="min-h-screen pb-24 bg-gray-50/50">
      
      {/* HERO SECTION (Se oculta si buscas o filtras) */}
      {!searchTerm && !category && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-10 md:rounded-b-[2.5rem] shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight leading-tight">
              ¡Hola! 👋 <br />
              <span className="text-blue-200">¿Qué buscas hoy?</span>
            </h1>
            <p className="text-blue-100 text-sm md:text-lg max-w-md opacity-90 font-medium">
              Explora miles de productos cerca de ti en Cuba. Compra y vende fácil.
            </p>
          </div>
        </div>
      )}

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

        {/* RESULTADOS */}
        <div className="px-4 mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {pageTitle}
          </h2>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {products.length} productos
          </span>
        </div>

        <div className="px-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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