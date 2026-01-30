"use client";

import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  title?: string; // Hacemos el título opcional por si lo usas en resultados de búsqueda
}

export function ProductGrid({ products, title }: ProductGridProps) {
  
  // 1. Manejo de estado vacío (Si no hay productos)
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-2">🔍</div>
        <h3 className="text-lg font-medium text-gray-900">No encontramos productos</h3>
        <p className="text-gray-500">Intenta ajustar tu búsqueda o categoría.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        {/* 2. Cabecera (Solo se renderiza si pasas un título) */}
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
              {title}
            </h2>
            {/* Opcional: Link a ver todos si es una sección destacada */}
            {/* <Link href="/search" className="text-sm font-medium text-blue-600 hover:underline">
              Ver todos
            </Link> */}
          </div>
        )}

        {/* 3. Grid Responsivo (El Core) */}
        {/* Móvil: 2 columnas | Tablet: 3 | Laptop: 4 | Pantallas Gigantes: 5 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}