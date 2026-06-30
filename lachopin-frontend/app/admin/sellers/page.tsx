import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getSellers, updateSeller, type ApiSeller } from "@/lib/api";
import { Check, X, Star, Search } from "lucide-react";
import CreateSellerForm from "@/app/admin/components/CreateSellerForm";

function SellerTypeBadge({ seller }: { seller: ApiSeller }) {
  if (seller.isRestaurant) {
    return <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">🍽️ Restaurante</span>;
  }
  const isWholesale = seller.products?.some((p) => p.category === "wholesale");
  if (isWholesale) {
    return <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🏢 Mayorista</span>;
  }
  return <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🏪 Tienda</span>;
}

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminSellersPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const allSellers = await getSellers().catch(() => []);

  const sellers = q
    ? allSellers.filter((s) => s.storeName.toLowerCase().includes(q.toLowerCase()))
    : allSellers;

  return (
    <div>
      <CreateSellerForm />

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <Star className="w-5 h-5 text-amber-500" /> Vendedores ({sellers.length})
        </h2>

        <form action="/admin/sellers" method="get" className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre de tienda..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>

        {sellers.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No se encontraron vendedores.</p>
        ) : (
          <div className="space-y-3">
            {sellers.map((seller) => (
              <div key={seller.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=random&color=fff`}
                      alt={seller.storeName}
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm line-clamp-1">{seller.storeName}</p>
                        <SellerTypeBadge seller={seller} />
                      </div>
                      <p className="text-xs text-gray-500">{seller.email}</p>
                      <p className="text-xs text-gray-400">{seller._count.products} productos • {seller._count.followers} seguidores</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={async () => {
                      "use server";
                      const { getToken } = await auth();
                      const token = await getToken();
                      await updateSeller(seller.id, { isVerified: !seller.isVerified }, token ?? undefined);
                      revalidatePath("/admin/sellers");
                    }}>
                      <button
                        className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors ${
                          seller.isVerified
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title={seller.isVerified ? "Quitar verificación" : "Verificar vendedor"}
                      >
                        {seller.isVerified ? <Check size={14} /> : <X size={14} />}
                        {seller.isVerified ? "Verificado" : "No verificado"}
                      </button>
                    </form>

                    <form action={async () => {
                      "use server";
                      const { getToken } = await auth();
                      const token = await getToken();
                      await updateSeller(seller.id, { isFeatured: !seller.isFeatured }, token ?? undefined);
                      revalidatePath("/admin/sellers");
                      revalidatePath("/");
                    }}>
                      <button
                        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                          seller.isFeatured
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title={seller.isFeatured ? "Quitar de la portada" : "Destacar en la portada"}
                      >
                        <Star size={16} className={seller.isFeatured ? "fill-amber-500 text-amber-500" : ""} />
                      </button>
                    </form>
                  </div>
                </div>

                <details className="mt-3">
                  <summary className="text-xs text-blue-600 cursor-pointer font-medium select-none">
                    Editar email (transferencia de perfil)
                  </summary>
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const email = formData.get("email") as string;
                      if (!email) return;
                      const { getToken } = await auth();
                      const token = await getToken();
                      await updateSeller(seller.id, { email }, token ?? undefined);
                      revalidatePath("/admin/sellers");
                    }}
                    className="flex items-center gap-2 mt-2"
                  >
                    <input
                      type="email"
                      name="email"
                      defaultValue={seller.email}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      Guardar
                    </button>
                  </form>
                </details>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
