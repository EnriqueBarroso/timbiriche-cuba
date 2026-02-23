import { getProducts } from "@/lib/actions";
import { ProductCard } from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  Building2, 
  Search, 
  PackageCheck, 
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "LaChopin Empresas | Venta Mayorista en Cuba",
  description: "Encuentra proveedores, importadores y lotes al por mayor para abastecer tu Mipyme, paladar o negocio en Cuba.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function MayoristasPage({ searchParams }: Props) {
  const { query, page } = await searchParams;
  
  const searchTerm = query || "";
  const currentPage = Number(page) || 1;
  
  // 👇 AQUÍ ESTÁ EL SECRETO: Le decimos a la base de datos que SOLO traiga "wholesale"
  const { products, total, totalPages } = await getProducts({ 
    query: searchTerm,
    category: "wholesale", 
    page: currentPage,
  });

  const currentSearchParams: Record<string, string | undefined> = {
    ...(searchTerm && { query: searchTerm }),
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      
      {/* HERO SECTION B2B (Diseño Premium Empresarial) */}
      <div className="bg-slate-900 text-white px-6 py-12 md:py-16 md:rounded-b-[2.5rem] shadow-2xl mb-8 relative overflow-hidden border-b-4 border-amber-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Building2 size={14} />
            <span>LaChopin B2B</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight text-white">
            Abastece tu negocio <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
              sin intermediarios.
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-xl font-medium mb-8">
            El portal exclusivo para Mipymes, hostales y paladares. Conecta directamente con importadores y compra lotes al por mayor.
          </p>

          {/* Badges de confianza */}
          <div className="flex flex-wrap gap-4 text-xs md:text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-1.5"><PackageCheck size={18} className="text-amber-500"/> Lotes y Contenedores</div>
            <div className="flex items-center gap-1.5"><TrendingUp size={18} className="text-amber-500"/> Precios por Volumen</div>
            <div className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-amber-500"/> Trato Directo</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* RESULTADOS */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            Catálogo Mayorista
          </h2>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">
            {total} lotes disponibles
          </span>
        </div>

        <div>
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={currentSearchParams}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white shadow-sm mt-4">
              <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100">
                <Building2 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Vitrina en construcción</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 px-4">
                ¿Eres importador o fabricante? Sé el primero en publicar tus lotes al por mayor y conecta con cientos de negocios en Cuba.
              </p>
              <Link href="/vender" className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                <PackageCheck size={18} />
                Publicar Lote Mayorista
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}