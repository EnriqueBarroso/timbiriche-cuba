// app/premium/page.tsx
import { prisma } from "@/lib/prisma"; // Asegúrate de tener tu instancia de Prisma aquí
import { ProductCard } from "@/components/ProductCard"; // Reutilizamos tu tarjeta de producto
import { Star } from "lucide-react"; // Un icono bonito para el título

// Forzamos que la página se renderice en el servidor en cada petición (dinámica)
export const revalidate = 0; 

async function getPremiumProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPromoted: true, // Solo traemos los marcados como premium
        isActive: true,   // Y que estén activos
        type: 'MARKETPLACE'
      },
      include: {
        images: true,    // Incluimos las imágenes
        seller: true,    // Incluimos info del vendedor para el enlace/WhatsApp
      },
      orderBy: {
        createdAt: 'desc', // Los más nuevos primero
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching premium products:", error);
    return [];
  }
}

export default async function PremiumPage() {
  const premiumProducts = await getPremiumProducts();

  return (
    <div className="flex flex-col gap-10">
      
      {/* Encabezado de la página con estilo Premium */}
      <header className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-10 shadow-lg text-white">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-full">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Ofertas Premium</h1>
        </div>
        <p className="text-amber-50 max-w-2xl text-lg">
          Descubre una selección exclusiva de los mejores productos de LaChopin. 
          Calidad garantizada, vendedores verificados y envíos rápidos.
        </p>
      </header>

      {/* Rejilla de productos */}
      <section>
        {premiumProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {premiumProducts.map((product) => (
              // Reutilizamos tu ProductCard actual. ¡Súper eficiente!
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // Estado vacío si no hay productos marcados
          <div className="text-center py-20 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Aún no hay ofertas premium</h3>
            <p className="text-gray-500 mt-1">¡Vuelve pronto para descubrir productos exclusivos!</p>
          </div>
        )}
      </section>
    </div>
  );
}