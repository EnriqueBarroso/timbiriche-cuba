import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyProductCard from "@/components/MyProductCard"; // 👇 Necesitamos crear este componente abajo
import { PackageOpen, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Product } from "@/types"; // Si no tienes types, puedes usar any en el map
import { deleteProduct } from "@/lib/actions";

export default async function MyProductsPage() {
  const user = await currentUser();
  if (!user) return redirect("/"); // Si no estás logueado, fuera.

  const email = user.emailAddresses[0].emailAddress;

  // Buscamos al vendedor por su email y traemos sus productos
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
            <p className="text-gray-500">Gestiona tus ventas activas desde aquí.</p>
          </div>
          <Link href="/vender" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg shadow-gray-200">
            <Plus className="w-5 h-5" /> Nueva Publicación
          </Link>
        </div>

        {/* Grid de Productos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products.map((product: any) => (
              // Envolvemos en relative group para posicionar la papelera encima de la tarjeta
              <div key={product.id} className="relative group">
                
                {/* 1. La tarjeta visual (sin lógica de botones) */}
                <MyProductCard product={product} />
                
                {/* 2. BOTÓN DE BORRAR (Superpuesto) */}
                <div className="absolute top-2 right-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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