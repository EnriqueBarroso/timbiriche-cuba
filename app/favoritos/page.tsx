import ProductCard from "@/components/ProductCard";
import { getMyFavorites } from "@/lib/actions";
import Link from "next/link";
import { Heart } from "lucide-react";

export default async function FavoritesPage() {
    const products = await getMyFavorites();

    return (
        <div className="min-h-screen py-10">
            <main className="max-w-7xl mx-auto px-4">

                {/* Encabezado */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <Heart className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
                        <p className="text-gray-500">
                            {products.length === 0
                                ? "Aún no has guardado nada."
                                : `Tienes ${products.length} productos guardados.`}
                        </p>
                    </div>
                </div>

                {/* Estado Vacío */}
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-xl text-gray-400 mb-6">Tu lista de deseos está vacía 🕸️</p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
                        >
                            Ir a explorar productos
                        </Link>
                    </div>
                ) : (
                    /* Rejilla de Favoritos */
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10 md:gap-8">
                        {/* Copia esta línea de comentario EXTACTAMENTE como está: */}
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}