import { getBusinesses } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Store, BadgeCheck, ShoppingBag, ArrowLeft, Building2 } from "lucide-react";
import JoinLaChopinFloatingCTA from "@/components/JoinLaChopinFloatingCTA";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Directorio de Tiendas | LaChopin",
  description: "Descubre todas las tiendas y vendedores verificados en LaChopin.",
};

// Mismas 9 categorías + imágenes que antes vivían en el home (app/page.tsx),
// movidas aquí como filtro del directorio de negocios.
const CATEGORIES = [
  { name: "Todas",      slug: "" },
  { name: "Celulares",  slug: "cellphones" },
  { name: "Vehículos",  slug: "vehicles" },
  { name: "Hogar",      slug: "home" },
  { name: "Electro",    slug: "appliances" },
  { name: "Ropa",       slug: "fashion" },
  { name: "Alimentos",  slug: "food" },
  { name: "Piezas",     slug: "parts" },
  { name: "Artesanía",  slug: "crafts" },
  { name: "Otros",      slug: "others" },
];

const CATEGORY_IMAGES: Record<string, string> = {
  cellphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  vehicles: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  home: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  appliances: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  food: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  parts: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  crafts: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
  others: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
};

function BusinessCard({ business }: { business: Awaited<ReturnType<typeof getBusinesses>>[number] }) {
  return (
    <Link
      href={`/vendedor/${business.slug}`}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
        <img
          src={business.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(business.storeName)}&background=random&color=fff`}
          alt={business.storeName}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors flex items-center justify-center gap-1 w-full">
        <span className="truncate">{business.storeName}</span>
        {business.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
      </h2>

      <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1 bg-gray-50 px-3 py-1 rounded-full w-fit">
        <ShoppingBag className="w-4 h-4" />
        {business._count.products} {business._count.products === 1 ? "Producto" : "Productos"}
      </p>
    </Link>
  );
}

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function TiendasPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = category || "";

  const allBusinesses = await getBusinesses(category ? { category } : undefined).catch(() => []);

  const tiendas = allBusinesses.filter((s) => !s.isRestaurant && !s.isWholesale);
  const mayoristas = allBusinesses.filter((s) => s.isWholesale);

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
          <p className="text-gray-500 mt-2 mb-6">Explora todos los negocios y emprendedores que venden en LaChopin.</p>

          {/* Chips de categoría — filtran los negocios listados según los
              productos activos que tengan en esa categoría. */}
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <Link
                  key={cat.slug || "todas"}
                  href={cat.slug ? `/tiendas?category=${cat.slug}` : "/tiendas"}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div
                    className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-100 border-2 transition-all ${
                      isActive ? "border-blue-600 ring-2 ring-blue-200" : "border-white group-hover:ring-2 group-hover:ring-blue-200"
                    }`}
                  >
                    {cat.slug ? (
                      <Image src={CATEGORY_IMAGES[cat.slug]} alt={cat.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <Store className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] md:text-xs font-medium text-center whitespace-nowrap ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`}>
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
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
              <p className="text-gray-500">
                {activeCategory ? "Ningún negocio tiene productos en esta categoría." : "Aún no hay tiendas disponibles."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {tiendas.map((business) => (
                <BusinessCard key={business.id} business={business} />
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
              {mayoristas.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </section>
        )}

      </div>

      <JoinLaChopinFloatingCTA />
    </div>
  );
}
