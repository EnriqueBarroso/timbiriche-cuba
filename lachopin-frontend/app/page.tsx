import { getProducts } from "@/lib/actions";
import { getBusinesses, type ApiBusiness } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Search, Compass, MessageCircle, Package } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

// Mismas imágenes ya verificadas/usadas en otras partes del proyecto
// (CATEGORY_IMAGES de esta misma página, avatar de Distribuidora El Puerto
// en seed-demo.js), recicladas aquí en vez de inventar fotos nuevas.
const VERTICALS = [
  {
    title: "Tiendas",
    description: "Encuentra comercios y tiendas locales",
    href: "/tiendas",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
  },
  {
    title: "Eats",
    description: "Pide comida a domicilio por WhatsApp",
    href: "/eats",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  },
  {
    title: "Mayoristas",
    description: "Compra por volumen para tu negocio",
    href: "/mayoristas",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: Compass,
    title: "Explora los negocios",
    description: "Encuentra tiendas, restaurantes y mayoristas cerca de ti.",
  },
  {
    icon: MessageCircle,
    title: "Contacta por WhatsApp",
    description: "Habla directo con el negocio, sin registros ni intermediarios.",
  },
  {
    icon: Package,
    title: "Recibe tu pedido",
    description: "Coordina la entrega directamente con el negocio.",
  },
];

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

// Nota: la fila visual de categorías (íconos circulares) se movió a /tiendas
// como filtro de negocios. CATEGORIES se mantiene aquí porque este mismo
// home sigue resolviendo /?category=xxx (usado por esos chips y por la
// búsqueda) mostrando la vista de productos filtrados por categoría.

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

// Mismo patrón que BusinessStorefront.tsx para el badge de tipo de negocio.
function businessTypeLabel(business: ApiBusiness) {
  if (business.isRestaurant) return "Paladar";
  if (business.isWholesale) return "Mayorista";
  return "Tienda";
}

function BusinessGridCard({ business }: { business: ApiBusiness }) {
  const cover =
    business.coverImage ||
    business.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(business.storeName)}&background=B84C24&color=fff`;
  const avatar =
    business.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(business.storeName)}&background=B84C24&color=fff`;

  return (
    <Link
      href={`/vendedor/${business.slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/3] border border-black/5 shadow-sm hover:shadow-md transition-shadow"
    >
      <Image
        src={cover}
        alt={business.storeName}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      <span
        className="absolute top-2 right-2 text-[10px] font-black uppercase tracking-wide text-white px-2 py-1 rounded-full"
        style={{ backgroundColor: TERRACOTTA }}
      >
        {businessTypeLabel(business)}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow shrink-0 bg-white">
          <Image src={avatar} alt="" fill sizes="36px" className="object-cover" />
        </div>
        <h3 className="text-white font-bold text-sm leading-tight drop-shadow line-clamp-1">
          {business.storeName}
        </h3>
      </div>
    </Link>
  );
}

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

  // Sin búsqueda ni categoría activa: es la vista por defecto del home, que
  // ahora muestra negocios en vez de "Novedades Recientes". Si hay búsqueda
  // o filtro de categoría (ej. desde los chips de Categorías o el buscador
  // del Navbar), se mantiene la vista de productos filtrados de siempre.
  const isDefaultView = !category && !searchTerm;

  let productsData = { products: [] as Awaited<ReturnType<typeof getProducts>>["products"], total: 0, totalPages: 0, currentPage };
  let businesses: ApiBusiness[] = [];

  if (isDefaultView) {
    try {
      businesses = await getBusinesses();
    } catch {
      // API caída — renderizar home vacío en lugar de 500
    }
  } else {
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

        {/* VERTICALES — Tiendas / Eats / Mayoristas */}
        <section className="pt-6 md:pt-8">
          <AnimateOnScroll direction="up">
            <div className="rounded-3xl p-5 md:p-8" style={{ backgroundColor: CREAM }}>
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: TERRACOTTA }}>
                Explora por tipo de negocio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {VERTICALS.map((v) => (
                  <Link
                    key={v.href}
                    href={v.href}
                    className="group relative block overflow-hidden rounded-2xl aspect-[4/3]"
                  >
                    <Image
                      src={v.image}
                      alt={v.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white text-xl font-black mb-1">{v.title}</h3>
                      <p className="text-white/85 text-sm">{v.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* CÓMO FUNCIONA — 3 pasos */}
        <section className="pt-8 md:pt-10">
          <AnimateOnScroll direction="up">
            <div className="rounded-3xl p-5 md:p-8" style={{ backgroundColor: CREAM }}>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: TERRACOTTA }}>
                  Cómo funciona
                </h2>
                <Link
                  href="/como-funciona"
                  className="text-xs font-medium hover:underline"
                  style={{ color: TERRACOTTA }}
                >
                  Saber más →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                {HOW_IT_WORKS_STEPS.map((step, index) => (
                  <div key={step.title} className="flex flex-col items-start">
                    <div className="relative mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${TERRACOTTA}1A`, color: TERRACOTTA }}
                      >
                        <step.icon size={26} />
                      </div>
                      <span
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                        style={{ backgroundColor: TERRACOTTA }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* NEGOCIOS (vista por defecto) o PRODUCTOS (búsqueda/categoría activa) */}
        <section id="productos" className="scroll-mt-24 md:scroll-mt-28 pt-10 md:pt-16 pb-10 md:pb-20">
          <AnimateOnScroll direction="up">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {isDefaultView ? "Negocios en LaChopin" : sectionTitle}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isDefaultView
                    ? "Descubre las tiendas, paladares y mayoristas de nuestra comunidad"
                    : "Descubre los productos más recientes de nuestras tiendas"}
                </p>
              </div>
              <Link
                href={isDefaultView ? "/tiendas" : "/"}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap ml-4"
              >
                Ver todos →
              </Link>
            </div>
          </AnimateOnScroll>

          {isDefaultView ? (
            businesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {businesses.map((business, index) => (
                  <AnimateOnScroll key={business.id} direction="up" delay={(index % 4) * 0.1}>
                    <BusinessGridCard business={business} />
                  </AnimateOnScroll>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-muted p-6 rounded-full mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Aún no hay negocios</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Vuelve pronto para descubrir los negocios de LaChopin.
                </p>
              </div>
            )
          ) : products.length > 0 ? (
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

          {!isDefaultView && total > 0 && (
            <p className="text-xs text-muted-foreground mt-4">{total} productos</p>
          )}
        </section>

      </div>
    </div>
  );
}
