import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/ProductCard"
import { HeroSection } from "@/components/HeroSection"
import { CategoriesBar } from "@/components/CategoriesBar" // 👈 Restaurado
import { Search } from "lucide-react"
import Link from "next/link"

// Función para obtener productos (Server Side)
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
      
      <main className="flex-1">
        {/* 2. Hero Section (Solo se muestra si no hay búsqueda/categoría activa para no molestar) */}
        {!params.search && !params.category && (
           <HeroSection />
        )}

        {/* 3. Grid de Productos */}
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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