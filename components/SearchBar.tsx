"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/");
  };

  return (
    <div className="md:hidden sticky top-[112px] z-30 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md px-4 py-2.5">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {/* Ícono de búsqueda */}
        <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
        
        {/* Botón de limpiar (solo visible si hay texto) */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Botón submit invisible para que Enter funcione */}
        <button type="submit" className="hidden" />
      </form>
    </div>
  );
}