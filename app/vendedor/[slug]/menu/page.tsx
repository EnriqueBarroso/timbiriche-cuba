import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import MenuItemCard from "@/components/MenuItemCard";
import FloatingCartBar from "@/components/FloatingCartBar";

interface MenuPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EatsMenuPage({ params }: MenuPageProps) {
  const { slug } = await params;

  const seller = await prisma.seller.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: { images: true }
      },
    },
  });

  if (!seller) notFound();

  const phoneNumber = seller.phoneNumber || "";

  return (
    // Fondo gris de la web, centramos el contenido para simular un móvil en pantallas grandes
    <main className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative pb-32 shadow-2xl">
        
        {/* Cabecera Sticky estilo App */}
        <header className="bg-white sticky top-0 z-10 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
          {/* Botón de volver al perfil del marketplace */}
          <Link 
            href={`/vendedor/${slug}`}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-200 transition"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              {seller.storeName || "Menú"}
            </h1>
            <p className="text-xs text-green-600 font-medium">Abierto ahora</p>
          </div>
        </header>

        {/* Banner/Categoría (Opcional, para darle más estilo) */}
        <div className="px-4 py-5">
          <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#D32F2F] inline-block pb-1 mb-2">
            Todos los platos
          </h2>
        </div>

        {/* Lista de Productos */}
        <section className="flex flex-col">
          {seller.products.length > 0 ? (
            seller.products.map((product) => (
              <MenuItemCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.title,
                  description: product.description,
                  price: product.price,
                  sellerId: seller.id,
                  image: product.images[0]?.url 
                }}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <span className="text-4xl mb-3">🍽️</span>
              <p>Este menú está vacío por el momento.</p>
            </div>
          )}
        </section>

        {/* Carrito Flotante */}
        <FloatingCartBar 
          sellerName={seller.storeName || "Restaurante"} 
          sellerPhoneNumber={phoneNumber} 
        />
      </div>
    </main>
  );
}