import { getProducts } from "@/lib/actions";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, UtensilsCrossed, Search } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import Newsletter from "@/components/Newsletter";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const CATEGORIES = [
  { name: "Todo",       slug: "" },
  { name: "Celulares",  slug: "cellphones" },
  { name: "Vehículos",  slug: "vehicles" },
  { name: "Hogar",      slug: "home" },
  { name: "Electro",    slug: "appliances" },
  { name: "Ropa",       slug: "fashion" },
  { name: "Alimentos",  slug: "food" },
  { name: "Piezas",     slug: "parts" },
  { name: "Artesanía",  slug: "crafts" },
  { name: "Otros",      slug: "others" },
];

// Subconjunto destacado para la grilla de colecciones de la home
const FEATURED_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "");

// Imágenes placeholder (Unsplash) por categoría — reemplazar por imágenes definitivas
const CATEGORY_IMAGES: Record<string, string> = {
  cellphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  vehicles: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  home: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  appliances: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  food: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  parts: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  crafts: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
  others: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
};

export const metadata: Metadata = {
  title: { absolute: "LaChopin | Tu Mercado Online en Cuba" },
  description:
    "La forma más fácil de comprar y vender en Cuba. Ropa, celulares, electrodomésticos y más. Conecta directamente con vendedores verificados.",
  alternates: { canonical: "https://www.lachopin.com" },
  openGraph: {
    title: "LaChopin | Tu Mercado Online en Cuba",
    description: "Descubre miles de productos cerca de ti en Cuba. Compra seguro, vende rápido.",
    url: "https://www.lachopin.com",
    siteName: "LaChopin",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "LaChopin - Tu Mercado Online en Cuba" }],
    locale: "es_ES",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    search?: string;
    query?: string;
    category?: string;
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const { search, query, category, page, sort, minPrice, maxPrice } = await searchParams;

  const searchTerm = search || query || "";
  const currentPage = Number(page) || 1;
  const currentSort = (sort as "recent" | "price_asc" | "price_desc") || "recent";
  const currentMinPrice = minPrice ? Number(minPrice) : undefined;
  const currentMaxPrice = maxPrice ? Number(maxPrice) : undefined;

  let productsData = { products: [] as Awaited<ReturnType<typeof getProducts>>["products"], total: 0, totalPages: 0, currentPage };

  try {
    productsData = await getProducts({
      query: searchTerm,
      category,
      page: currentPage,
      sort: currentSort,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
    });
  } catch {
    // API caída — renderizar home vacío en lugar de 500
  }

  const { products, total, totalPages } = productsData;

  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name || category;

  const sectionTitle = category
    ? `Explorando: ${categoryName}`
    : searchTerm
    ? `Resultados para "${searchTerm}"`
    : "Novedades Recientes";

  const currentSearchParams: Record<string, string | undefined> = {
    ...(searchTerm && { query: searchTerm }),
    ...(category && { category }),
    ...(sort && sort !== "recent" && { sort }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
  };

  return (
    <div className="min-h-screen pb-16 bg-background">

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-24">

        {/* HERO — dentro del contenedor, con esquinas redondeadas */}
        <HeroCarousel />

        {/* PRODUCTOS */}
        <section id="productos" className="scroll-mt-24 md:scroll-mt-28 pt-10 md:pt-16 pb-10 md:pb-20">
          <AnimateOnScroll direction="up">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{sectionTitle}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Descubre los productos más recientes de nuestras tiendas
                </p>
              </div>
              <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap ml-4">
                Ver todos →
              </Link>
            </div>
          </AnimateOnScroll>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((product: any, index: number) => (
                  <AnimateOnScroll key={product.id} direction="up" delay={(index % 4) * 0.1}>
                    <ProductCard
                      product={product}
                      categoryLabel={CATEGORIES.find((c) => c.slug === product.category)?.name}
                    />
                  </AnimateOnScroll>
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
              <div className="bg-muted p-6 rounded-full mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No hay productos aquí</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                {searchTerm
                  ? `No encontramos nada con "${searchTerm}".`
                  : `Sé el primero en publicar en la categoría ${categoryName}.`
                }
              </p>
              <Link
                href="/vender"
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-hover transition-colors"
              >
                Publicar Ahora
              </Link>
            </div>
          )}

          {total > 0 && (
            <p className="text-xs text-muted-foreground mt-4">{total} productos</p>
          )}
        </section>

        {/* BANNER EATS */}
        <section className="py-10 md:py-20">
          <AnimateOnScroll direction="up">
            <Link
              href="/eats"
              className="flex items-center justify-between gap-4 bg-card rounded-2xl p-6 md:p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="bg-background p-3 sm:p-4 rounded-full">
                  <UtensilsCrossed className="text-primary w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    LaChopin Eats
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Pide comida a los mejores restaurantes por WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex bg-background p-2 rounded-full">
                <ArrowRight className="text-foreground" size={20} />
              </div>
            </Link>
          </AnimateOnScroll>
        </section>

        {/* CATEGORÍAS */}
        <section className="py-10 md:py-20">
          <AnimateOnScroll direction="up">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nuestras Categorías</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Encuentra lo que buscas en nuestras colecciones
                </p>
              </div>
              <Link href="/categorias" className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap ml-4">
                Ver todas →
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {FEATURED_CATEGORIES.slice(0, 6).map((cat, index) => (
              <AnimateOnScroll key={cat.slug} direction="up" delay={(index % 3) * 0.1}>
                <CategoryCard
                  name={cat.name}
                  href={`/?category=${cat.slug}#productos`}
                  image={CATEGORY_IMAGES[cat.slug]}
                />
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <AnimateOnScroll direction="up">
          <Newsletter />
        </AnimateOnScroll>

      </div>
    </div>
  );
}
