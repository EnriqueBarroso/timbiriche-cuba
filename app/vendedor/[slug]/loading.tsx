import { ProductSkeleton } from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Header Skeleton (Simula el perfil del vendedor) */}
      <div className="bg-white border-b border-gray-200">
        {/* Banner gris */}
        <div className="h-32 md:h-48 bg-gray-200 w-full animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 mb-6">
            
            {/* Avatar Skeleton */}
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white bg-gray-300 animate-pulse"></div>
            </div>

            {/* Info Texto Skeleton */}
            <div className="text-center md:text-left flex-1 space-y-3 w-full md:w-auto flex flex-col items-center md:items-start">
              {/* Nombre tienda */}
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              {/* Info extra */}
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              {/* Badges */}
              <div className="flex gap-2">
                 <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                 <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid de Productos Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>

        {/* Usamos tu componente ProductSkeleton repetido 8 veces */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}