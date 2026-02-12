// components/Pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Construir URL preservando los query params existentes (category, query)
  function buildUrl(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  // Calcular qué páginas mostrar (max 5 visibles)
  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }

  const pages = getPageNumbers();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1.5 py-8">
      {/* Anterior */}
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-300 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Números de página */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="flex items-center justify-center w-10 h-10 text-gray-400 text-sm"
          >
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }`}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Siguiente */}
      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-300 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </nav>
  );
}