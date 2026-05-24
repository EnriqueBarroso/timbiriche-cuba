export function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {/* 1. Imagen cuadrada */}
      <div className="aspect-square w-full animate-pulse bg-gray-200" />

      <div className="flex flex-1 flex-col p-4 space-y-3">
        {/* 2. Título (2 líneas) */}
        <div className="space-y-1">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>

        {/* 3. Precio */}
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />

        {/* 4. Vendedor (Círculo + Texto) */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>

        {/* 5. Botones de abajo (Espaciador + Botón) */}
        <div className="mt-auto flex gap-2 pt-2">
          <div className="h-10 flex-1 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}