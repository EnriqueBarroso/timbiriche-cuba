// app/buscar/page.tsx
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: Props) {
  // Obtenemos el parámetro 'q' de la URL
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Resultados */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <div className="flex-1">
             <h1 className="text-lg font-bold text-gray-900 leading-none">Resultados de búsqueda</h1>
             <p>Resultados para &quot;{query}&quot;</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {query ? (
          <ProductGrid searchQuery={query} />
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Escribe algo para buscar</p>
          </div>
        )}
      </main>
    </div>
  );
}   