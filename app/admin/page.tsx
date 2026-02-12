import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Check, Trash2, ShieldAlert, Store } from "lucide-react";
import { revalidatePath } from "next/cache";
import { isAdmin, formatPrice } from '@/lib/utils';
import PromoteButton from "@/components/PromoteButton"; // ✅ NUEVO

export default async function AdminPage() {
  const user = await currentUser();

  // 1. Seguridad: Si no es el admin, lo mandamos al inicio
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  
  if (!isAdmin(userEmail)) {
    return redirect("/");
  }

  // 2. Obtener datos
  const pendingSellers = await prisma.seller.findMany({
    where: { isVerified: false },
    orderBy: { createdAt: 'desc' }
  });

  const allProducts = await prisma.product.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { 
      seller: true,
      images: true 
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Panel de Control
          </h1>
          <p className="text-gray-500">Bienvenido, Admin. Aquí mandas tú.</p>
        </header>

        {/* --- SECCIÓN 1: VENDEDORES PENDIENTES --- */}
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
                    <p className="text-sm text-gray-500">{seller.email}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {seller.id}</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    await prisma.seller.update({
                      where: { id: seller.id },
                      data: { isVerified: true }
                    });
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

        {/* --- SECCIÓN 2: MODERACIÓN DE PRODUCTOS --- */}
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
                    
                    {/* ✅ NUEVO: Botones agrupados (Promote + Delete) */}
                    <div className="flex items-center gap-2">
                        <PromoteButton productId={product.id} isPromoted={product.isPromoted} />
                        <form action={async () => {
                            "use server";
                            await prisma.product.delete({ where: { id: product.id }});
                            revalidatePath("/admin");
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