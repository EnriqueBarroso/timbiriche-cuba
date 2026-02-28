import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyProductCard from "@/components/MyProductCard"; 
import { PackageOpen, Plus, Pencil, Eye } from "lucide-react"; // ✅ Añadimos Eye
import Link from "next/link";
import DeleteProductButton from "@/components/DeleteProductButton";
import SoldToggleButton from "@/components/SoldToggleButton"; 

export default async function MyProductsPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const email = user.emailAddresses[0].emailAddress;

  const seller = await prisma.seller.findUnique({
    where: { email },
    include: {
      products: {
        include: { images: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const products = seller?.products || [];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
            <p className="text-gray-500">Gestiona tus ventas y revisa el alcance de tus productos.</p>
          </div>
          <Link href="/vender" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
            <Plus className="w-5 h-5" /> Nueva Publicación
          </Link>
        </div>

        {/* Grid de Productos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products.map((product: any) => (
              <div key={product.id} className="relative flex flex-col group bg-white rounded-2xl p-2 border border-transparent hover:border-blue-100 transition-all">

                {/* 1. Tarjeta */}
                <div className={product.isSold ? "opacity-60 grayscale transition-all" : "transition-all"}>
                   <MyProductCard product={product} />
                </div>

                {/* 📊 NUEVO: Estadísticas para el Vendedor (Dopamina) */}
                <div className="mt-3 px-2 pb-2 flex items-center justify-between border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>{product.views || 0} vistas</span>
                  </div>
                  
                  {/* Aquí podrías añadir un indicador de "Interés" si el producto tiene muchas vistas */}
                  {product.views > 100 && !product.isSold && (
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-tight">¡Popular! 🔥</span>
                  )}
                </div>

                {/* 2. Etiqueta de VENDIDO */}
                {product.isSold && (
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 bg-black/80 text-white px-4 py-1 rounded-full font-bold text-sm -rotate-12 border-2 border-white shadow-xl pointer-events-none">
                    VENDIDO
                  </div>
                )}

                {/* 3. BOTONERA SUPERIOR (Overlays) */}
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  
                  <SoldToggleButton productId={product.id} isSold={product.isSold} />

                  <Link 
                    href={`/editar/${product.id}`}
                    className="bg-white/95 p-2 rounded-full text-blue-600 hover:text-blue-700 hover:bg-white shadow-md backdrop-blur-sm transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>

                  <div className="bg-white/95 rounded-full shadow-md backdrop-blur-sm hover:bg-white transition-all">
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Estado Vacío */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aún no has publicado nada</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Sube tus productos para empezar a recibir visitas y ofertas.
            </p>
            <Link href="/vender" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-blue-700 transition-all">
              Comenzar a vender &rarr;
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}