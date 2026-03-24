"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

type SortOption = "recent" | "price_asc" | "price_desc";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Más recientes",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
};

const CURRENCIES = ["USD", "MLC", "EUR", "CUP"];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Valores actuales en la URL (fuente de verdad)
  const urlSort = (searchParams.get("sort") as SortOption) || "recent";
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const urlCurrency = searchParams.get("priceCurrency") || "USD";

  // Estado local del panel — se inicializa con los valores de la URL al abrir
  const [isOpen, setIsOpen] = useState(false);
  const [draftSort, setDraftSort] = useState<SortOption>(urlSort);
  const [draftMin, setDraftMin] = useState(urlMinPrice);
  const [draftMax, setDraftMax] = useState(urlMaxPrice);
  const [draftCurrency, setDraftCurrency] = useState(urlCurrency);

  // Cuántos filtros activos hay (para el badge del botón)
  const activeCount = [
    urlSort !== "recent" ? 1 : 0,
    urlMinPrice || urlMaxPrice ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  function openPanel() {
    // Al abrir, sincronizamos el borrador con la URL actual
    setDraftSort(urlSort);
    setDraftMin(urlMinPrice);
    setDraftMax(urlMaxPrice);
    setDraftCurrency(urlCurrency);
    setIsOpen(true);
  }

  function buildUrl(sort: SortOption, min: string, max: string, currency: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (sort !== "recent") params.set("sort", sort);
    else params.delete("sort");

    if (min) params.set("minPrice", min);
    else params.delete("minPrice");

    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");

    // Solo guardamos la moneda del precio si hay rango activo
    if ((min || max) && currency !== "USD") params.set("priceCurrency", currency);
    else params.delete("priceCurrency");

    return `/?${params.toString()}`;
  }

  function applyFilters() {
    startTransition(() => {
      router.push(buildUrl(draftSort, draftMin, draftMax, draftCurrency));
      setIsOpen(false);
    });
  }

  function clearAll() {
    setDraftSort("recent");
    setDraftMin("");
    setDraftMax("");
    setDraftCurrency("USD");
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("sort");
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("priceCurrency");
      params.delete("page");
      router.push(`/?${params.toString()}`);
      setIsOpen(false);
    });
  }

  function removeSortChip() {
    startTransition(() => {
      router.push(buildUrl("recent", urlMinPrice, urlMaxPrice, urlCurrency));
    });
  }

  function removePriceChip() {
    startTransition(() => {
      router.push(buildUrl(urlSort, "", "", "USD"));
    });
  }

  return (
    <div className="relative px-4 mb-4">
      <div className="flex items-center gap-2 flex-wrap">

        {/* Botón principal */}
        <button
          onClick={openPanel}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all active:scale-95 ${
            activeCount > 0
              ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
          }`}
        >
          <SlidersHorizontal size={15} />
          Filtros
          {activeCount > 0 && (
            <span className="bg-white text-blue-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Chip de ordenamiento activo */}
        {urlSort !== "recent" && (
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold">
            {SORT_LABELS[urlSort]}
            <button onClick={removeSortChip} className="ml-0.5 hover:text-blue-900">
              <X size={11} />
            </button>
          </span>
        )}

        {/* Chip de rango de precio activo */}
        {(urlMinPrice || urlMaxPrice) && (
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold">
            {urlMinPrice && urlMaxPrice
              ? `${urlMinPrice}–${urlMaxPrice} ${urlCurrency}`
              : urlMinPrice
              ? `Desde ${urlMinPrice} ${urlCurrency}`
              : `Hasta ${urlMaxPrice} ${urlCurrency}`}
            <button onClick={removePriceChip} className="ml-0.5 hover:text-blue-900">
              <X size={11} />
            </button>
          </span>
        )}
      </div>

      {/* Panel desplegable */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />

          <div className="absolute left-4 top-full mt-2 z-40 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-5 w-[min(calc(100vw-2rem),340px)] animate-in fade-in slide-in-from-top-2 duration-150">

            {/* Ordenar por */}
            <div className="mb-5">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                Ordenar por
              </p>
              <div className="flex flex-col gap-2">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDraftSort(option)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                      draftSort === option
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${draftSort === option ? "bg-white" : "bg-gray-300"}`} />
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de precios */}
            <div className="mb-5">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                Rango de precio
              </p>

              {/* Selector de moneda */}
              <div className="flex gap-1.5 mb-3">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setDraftCurrency(c)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      draftCurrency === c
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Inputs min/max */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    placeholder="Mín"
                    value={draftMin}
                    onChange={(e) => setDraftMin(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 transition-all"
                  />
                </div>
                <span className="text-gray-300 font-bold text-lg">—</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    placeholder="Máx"
                    value={draftMax}
                    onChange={(e) => setDraftMax(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={applyFilters}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors active:scale-95 disabled:opacity-60"
              >
                {isPending ? "Aplicando..." : "Aplicar"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}