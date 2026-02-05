import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyProductCard from "@/components/MyProductCard"; 
import { PackageOpen, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import DeleteProductButton from "@/components/DeleteProductButton";
// 👇 Importamos el componente cliente para el botón de vendido
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
              <div key={product.id} className="relative group">

                {/* 1. Tarjeta (Si está vendido, se verá un poco transparente) */}
                <div className={product.isSold ? "opacity-60 grayscale transition-all" : "transition-all"}>
                   <MyProductCard product={product} />
                </div>

                {/* 2. Etiqueta de VENDIDO (Visual) */}
                {product.isSold && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 bg-black/80 text-white px-4 py-1 rounded-full font-bold text-sm -rotate-12 border-2 border-white shadow-xl pointer-events-none">
                    VENDIDO
                  </div>
                )}

                {/* 3. BOTONERA SUPERIOR */}
                <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  
                  {/* NUEVO: Botón Vendido/Disponible */}
                  <SoldToggleButton productId={product.id} isSold={product.isSold} />

                  {/* Botón EDITAR */}
                  <Link 
                    href={`/editar/${product.id}`}
                    className="bg-white/90 p-2 rounded-full text-blue-600 hover:text-blue-700 hover:bg-white shadow-sm backdrop-blur-sm transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>

                  {/* Botón BORRAR */}
                  <div className="bg-white/90 rounded-full shadow-sm backdrop-blur-sm hover:bg-white transition-all">
                    <DeleteProductButton productId={product.id} />
                  </div>

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