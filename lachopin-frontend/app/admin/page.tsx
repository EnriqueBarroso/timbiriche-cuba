import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSellers, getProducts, updateSeller, deleteProduct } from "@/lib/api";

export const dynamic = "force-dynamic";
import { Check, Trash2, ShieldAlert, Store, Star } from "lucide-react";
import { revalidatePath } from "next/cache";
import { isAdmin, formatPrice } from "@/lib/utils";
import PromoteButton from "@/components/PromoteButton";

export default async function AdminPage() {
  const user = await currentUser();

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!isAdmin(userEmail)) {
    return redirect("/");
  }

  const [pendingSellers, verifiedSellers, allProducts] = await Promise.all([
    getSellers({ isVerified: false }).catch(() => []),
    getSellers({ isVerified: true }).catch(() => []),
    getProducts({ limit: 20 }).catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Panel de Control
          </h1>
          <p className="text-gray-500">Bienvenido, Admin. Aquí mandas tú.</p>
        </header>

        {/* SECCIÓN 1: VENDEDORES PENDIENTES */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Store className="w-5 h-5" /> Solicitudes de Verificación
          </h2>

          {pendingSellers.length === 0 ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
              ✅ Todo limpio. No hay vendedores esperando.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSellers.map((seller) => (
                <div key={seller.id} className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-xl gap-4">
                  <div>
                    <p className="font-bold text-lg">{seller.storeName}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {seller.id}</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    const { getToken } = await auth();
                    const token = await getToken();
                    await updateSeller(seller.id, { isVerified: true }, token ?? undefined);
                    revalidatePath("/admin");
                  }}>
                    <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                      <Check size={18} /> Aprobar Vendedor
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN 2: TIENDAS (DESTACAR EN PORTADA) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Star className="w-5 h-5 text-amber-500" /> Gestión de Tiendas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {verifiedSellers.map((seller) => (
              <div key={seller.id} className={`flex items-center justify-between border p-4 rounded-xl gap-4 transition-all ${seller.isFeatured ? "border-amber-300 bg-amber-50/30" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <img
                    src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName)}&background=random&color=fff`}
                    alt={seller.storeName}
                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                  />
                  <div>
                    <p className="font-bold text-sm line-clamp-1">{seller.storeName}</p>
                    <p className="text-xs text-gray-500">{seller._count.products} productos</p>
                  </div>
                </div>

                <form action={async () => {
                  "use server";
                  const { getToken } = await auth();
                  const token = await getToken();
                  await updateSeller(seller.id, { isFeatured: !seller.isFeatured }, token ?? undefined);
                  revalidatePath("/admin");
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
                    <Star size={18} className={seller.isFeatured ? "fill-amber-500 text-amber-500" : ""} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 3: MODERACIÓN DE PRODUCTOS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📦 Últimos Productos (Vigilancia)</h2>
          <div className="divide-y">
            {allProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  {product.images && product.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0].url}
                      alt="img"
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs">Sin img</div>
                  )}

                  <div>
                    <a href={`/product/${product.id}`} target="_blank" className="font-medium hover:underline text-blue-600 line-clamp-1">
                      {product.title}
                    </a>
                    <p className="text-xs text-gray-400">
                      {product.seller?.storeName || "Vendedor desconocido"} • {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PromoteButton productId={product.id} isPromoted={product.isPromoted} />
                  <form action={async () => {
                    "use server";
                    const { getToken } = await auth();
                    const token = await getToken();
                    await deleteProduct(product.id, token ?? undefined);
                    revalidatePath("/admin");
                    revalidatePath("/");
                  }}>
                    <button
                      className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Borrar Producto Inmediatamente"
                    >
                      <Trash2 size={20} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
