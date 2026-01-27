import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyProductCard from "@/components/MyProductCard";
import { PackageOpen, Plus, Trash2 } from "lucide-react"; // Importamos Trash2
import Link from "next/link";
import { Product } from "@/types";
import { deleteProduct } from "@/lib/actions"; // Importamos la acción de borrar

export default async function MyProductsPage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const email = user.emailAddresses[0].emailAddress;

  // ESTO ES LO QUE FUNCIONABA: Buscamos por tu Email de vendedor
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
            <p className="text-gray-500">Gestiona tus ventas activas desde aquí.</p>
          </div>
          <Link href="/vender" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg shadow-gray-200">
            <Plus className="w-5 h-5" /> Nueva Publicación
          </Link>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              // Envolvemos en relative group para posicionar la papelera
              <div key={product.id} className="relative group">
                
                {/* Tu tarjeta original */}
                <MyProductCard product={product as unknown as Product} />
                
                {/* BOTÓN DE BORRAR (Lo nuevo) */}
                <div className="absolute top-2 right-2 z-10">
                  <form action={async () => {
                    "use server";
                    await deleteProduct(product.id);
                  }}>
                    <button 
                      type="submit"
                      className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm border border-red-100 hover:bg-red-50 hover:scale-110 transition-all"
                      title="Eliminar publicación"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        ) : (
          // Estado Vacío
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aún no has publicado nada</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Tus productos en venta aparecerán aquí. ¡Anímate a subir el primero!
            </p>
            <Link href="/vender" className="text-blue-600 font-bold hover:underline">
              Comenzar a vender &rarr;
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}