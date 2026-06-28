import { getSellers, getProducts, getProductsPage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Store, PackagePlus, ShieldAlert, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [allSellers, pendingSellers, recentProducts, productsPage] = await Promise.all([
    getSellers().catch(() => []),
    getSellers({ isVerified: false }).catch(() => []),
    getProducts({ limit: 5 }).catch(() => []),
    getProductsPage({ page: 1, limit: 1 }).catch(() => ({ total: 0, products: [], totalPages: 0, currentPage: 1 })),
  ]);

  const stats = [
    { label: "Vendedores", value: allSellers.length, icon: Store, color: "text-blue-600" },
    { label: "Productos", value: productsPage.total, icon: Package, color: "text-emerald-600" },
    { label: "Pendientes de verificar", value: pendingSellers.length, icon: ShieldAlert, color: "text-amber-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <PackagePlus className="w-5 h-5" /> Últimos Productos
        </h2>
        <div className="divide-y">
          {recentProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No hay productos todavía.</p>
          ) : (
            recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  {product.images && product.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0].url}
                      alt="img"
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs">Sin img</div>
                  )}
                  <div>
                    <a href={`/product/${product.id}`} target="_blank" className="font-medium hover:underline text-blue-600 line-clamp-1 text-sm">
                      {product.title}
                    </a>
                    <p className="text-xs text-gray-400">
                      {product.seller?.storeName || "Vendedor desconocido"} • {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
