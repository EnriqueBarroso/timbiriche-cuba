import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getSellers, getProductsPage, deleteProduct, updateProduct } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { Trash2, PackagePlus, ChevronLeft, ChevronRight } from "lucide-react";
import PromoteButton from "@/components/PromoteButton";
import CreateProductForm from "@/app/admin/components/CreateProductForm";

export const dynamic = "force-dynamic";

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");
const PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{ sellerId?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { sellerId, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [allSellers, productsPage] = await Promise.all([
    getSellers().catch(() => []),
    getProductsPage({ page: currentPage, limit: PAGE_SIZE, sellerId: sellerId || undefined }).catch(() => ({
      products: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    })),
  ]);

  const sellerOptions = allSellers.map((s) => ({ id: s.id, storeName: s.storeName }));

  return (
    <div>
      <CreateProductForm sellers={sellerOptions} />

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <PackagePlus className="w-5 h-5" /> Productos ({productsPage.total})
        </h2>

        <form action="/admin/products" method="get" className="flex items-center gap-2 mb-4">
          <select
            name="sellerId"
            defaultValue={sellerId || ""}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos los vendedores</option>
            {sellerOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-lg"
          >
            Filtrar
          </button>
        </form>

        <div className="divide-y">
          {productsPage.products.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No hay productos para este filtro.</p>
          ) : (
            productsPage.products.map((product) => (
              <div key={product.id} className="py-4">
                <div className="flex items-center justify-between gap-4">
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
                      revalidatePath("/admin/products");
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

                <details className="mt-2">
                  <summary className="text-xs text-blue-600 cursor-pointer font-medium select-none">
                    Editar
                  </summary>
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const title = formData.get("title") as string;
                      const price = Number(formData.get("price"));
                      const category = formData.get("category") as string;
                      const { getToken } = await auth();
                      const token = await getToken();
                      await updateProduct(product.id, { title, price, category }, token ?? undefined);
                      revalidatePath("/admin/products");
                      revalidatePath("/");
                    }}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2"
                  >
                    <input
                      type="text"
                      name="title"
                      defaultValue={product.title}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:col-span-2"
                    />
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      defaultValue={product.price}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <select
                      name="category"
                      defaultValue={product.category}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg sm:col-span-4"
                    >
                      Guardar cambios
                    </button>
                  </form>
                </details>
              </div>
            ))
          )}
        </div>

        {productsPage.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <a
              href={`/admin/products?${new URLSearchParams({ ...(sellerId && { sellerId }), page: String(currentPage - 1) })}`}
              className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg ${
                currentPage <= 1 ? "text-gray-300 pointer-events-none" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={16} /> Anterior
            </a>
            <p className="text-sm text-gray-500">
              Página {productsPage.currentPage} de {productsPage.totalPages}
            </p>
            <a
              href={`/admin/products?${new URLSearchParams({ ...(sellerId && { sellerId }), page: String(currentPage + 1) })}`}
              className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg ${
                currentPage >= productsPage.totalPages ? "text-gray-300 pointer-events-none" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Siguiente <ChevronRight size={16} />
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
