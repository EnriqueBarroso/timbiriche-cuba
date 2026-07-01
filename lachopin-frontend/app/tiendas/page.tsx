import { getSellers } from "@/lib/api";
import Link from "next/link";
import { Store, BadgeCheck, ShoppingBag, ArrowLeft, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Directorio de Tiendas | LaChopin",
  description: "Descubre todas las tiendas y vendedores verificados en LaChopin.",
};

function SellerCard({ seller }: { seller: Awaited<ReturnType<typeof getSellers>>[number] }) {
  return (
    <Link
      href={`/vendedor/${seller.slug}`}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
        <img
          src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=random&color=fff`}
          alt={seller.storeName}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors flex items-center justify-center gap-1 w-full">
        <span className="truncate">{seller.storeName}</span>
        {seller.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
      </h2>

      <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1 bg-gray-50 px-3 py-1 rounded-full w-fit">
        <ShoppingBag className="w-4 h-4" />
        {seller._count.products} {seller._count.products === 1 ? "Producto" : "Productos"}
      </p>
    </Link>
  );
}

export default async function TiendasPage() {
  const allSellers = await getSellers().catch(() => []);

  const tiendas = allSellers.filter((s) => !s.isRestaurant && !s.isWholesale);
  const mayoristas = allSellers.filter((s) => s.isWholesale);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-200 shadow-sm pt-8 pb-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" /> Directorio de Negocios
          </h1>
          <p className="text-gray-500 mt-2">Explora todos los negocios y emprendedores que venden en LaChopin.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* TIENDAS */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Store className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-extrabold text-gray-900">Tiendas</h2>
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tiendas.length}</span>
          </div>

          {tiendas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aún no hay tiendas disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {tiendas.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          )}
        </section>

        {/* MAYORISTAS */}
        {(mayoristas.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-extrabold text-gray-900">Mayoristas</h2>
              <span className="text-sm font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">{mayoristas.length}</span>
            </div>
            <p className="text-sm text-gray-500 mb-5">Proveedores y distribuidores que venden por volumen para negocios.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {mayoristas.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
