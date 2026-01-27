"use client"

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/actions"; // Importamos la acción que acabamos de crear
import { Loader2 } from "lucide-react"; // Icono de carga

interface Props {
  initialProducts: any[]; // Los primeros 12 que vienen del servidor
  searchQuery?: string;
  categorySlug?: string;
}

export default function ProductGrid({ initialProducts, searchQuery, categorySlug }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Si cambia la búsqueda o categoría, reseteamos la lista con los nuevos datos iniciales
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialProducts.length === 12); // Si trajimos menos de 12, no hay más
  }, [initialProducts, searchQuery, categorySlug]);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const nextPage = page + 1;
    
    // Llamamos al servidor para pedir la siguiente página
    const newProducts = await getProducts({
      query: searchQuery,
      category: categorySlug,
      page: nextPage,
    });

    if (newProducts.length < 12) {
      setHasMore(false); // Ya no quedan más productos
    }

    setProducts([...products, ...newProducts]); // Añadimos los nuevos a la lista
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <div>
      {/* Rejilla de Productos */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mensaje de "No hay resultados" */}
      {products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No encontramos productos con esa búsqueda 😔</p>
        </div>
      )}

      {/* Botón Cargar Más */}
      {hasMore && products.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 rounded-full shadow-sm text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando...
              </>
            ) : (
              "Cargar más productos 👇"
            )}
          </button>
        </div>
      )}
    </div>
  );
}