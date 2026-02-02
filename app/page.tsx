import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/ProductCard"
import { HeroSection } from "@/components/HeroSection"
import { CategoriesBar } from "@/components/CategoriesBar"
import { SearchBar } from "@/components/SearchBar"
import { Search, X } from "lucide-react"
import Link from "next/link"

// ✅ FUNCIÓN PARA OBTENER PRODUCTOS (Server Side)
async function getProducts(search?: string, category?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.category = category;
  }

  try {
    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        seller: true,
      },
    });
  } catch (error) {
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params.search, params.category);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      
      {/* 1. Carrusel de Categorías (Pegajoso debajo del Navbar) */}
      <CategoriesBar />
      
      {/* 2. Barra de Búsqueda (Solo Móvil) */}
      <SearchBar />
      
      <main className="min-h-screen pb-20">
        {/* 3. Hero Section (Solo se muestra si no hay búsqueda/categoría activa) */}
        {!params.search && !params.category && (
           <HeroSection />
        )}

        {/* 4. Banner de Filtros Activos */}
        {(params.search || params.category) && (
          <div className="bg-blue-50 border-b border-blue-100 py-3">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-blue-900">
                  Filtrando:
                </p>
                {params.search && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Search className="h-3.5 w-3.5" />
                    &quot;{params.search}&quot;
                  </span>
                )}
                {params.category && params.category !== "all" && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    📂 {params.category}
                  </span>
                )}
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Link>
            </div>
          </div>
        )}

        {/* 5. Grid de Productos */}
        <div id="products" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {params.search 
                ? `Resultados para "${params.search}"`
                : params.category 
                  ? "Explorando Categoría"
                  : "Novedades"
              }
            </h2>
            <span className="text-sm text-muted-foreground">
              {products.length} productos
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/25">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No encontramos nada</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Prueba con otros términos o elimina los filtros.
              </p>
              <Link 
                href="/" 
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Ver todo
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}