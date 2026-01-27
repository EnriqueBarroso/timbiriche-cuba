import ProductGrid from "@/components/ProductGrid";
import CategoryCarousel from "@/components/CategoryCarousel";
import { getProducts } from "@/lib/actions";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  // 1. Hacemos la petición inicial en el SERVIDOR (Rápido y SEO friendly)
  const initialProducts = await getProducts({
    query: query,
    category: category,
    page: 1, // Siempre pedimos la página 1 al entrar
  });

  return (
    <div className="min-h-screen">
      
      <CategoryCarousel />

      <main className="max-w-7xl mx-auto px-4">
        
        <div className="py-10 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            {query 
              ? `🔍 Resultados para "${query}"` 
              : category 
                ? `📂 Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`
                : "🔥 Novedades Recientes"
            }
          </h2>
          <p className="text-gray-500 text-lg">
            {query || category ? "Explora lo que hemos encontrado para ti." : "Las últimas publicaciones de nuestra comunidad."}
          </p>
        </div>

        <div className="pb-20">
            {/* 2. Le pasamos los datos iniciales al componente Cliente */}
            <ProductGrid 
              initialProducts={initialProducts} 
              searchQuery={query} 
              categorySlug={category} 
            />
        </div>
        
      </main>
    </div>
  );
}