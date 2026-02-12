"use client";

import Link from "next/link";
import { Heart, ArrowLeft, Store, User } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductCard } from "@/components/ProductCard";

// Definimos el tipo de datos para los vendedores que vienen del servidor
interface SellerFollowed {
    id: string;
    seller: {
        storeName: string | null;
        avatar: string | null;
        _count: {
            products: number;
        };
    };
}

export default function FavoritesClient({ following }: { following: SellerFollowed[] }) {
    const { favorites } = useFavorites();

    const hasFavorites = favorites.length > 0;
    const hasFollowing = following.length > 0;

    // CASO 1: NO HAY NADA (Ni favoritos ni seguidores) -> Pantalla vacía original
    if (!hasFavorites && !hasFollowing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-gray-50">
                <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <Heart size={48} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin favoritos aún</h2>
                <p className="text-gray-500 mb-8 text-center max-w-sm">
                    Guarda lo que te gusta o sigue a tus vendedores preferidos.
                </p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    Explorar Timbiriche
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header con botón de volver */}
                <div className="flex items-center gap-2 mb-8">
                    <Link href="/" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Mi Colección
                    </h1>
                </div>

                {/* --- SECCIÓN 1: VENDEDORES QUE SIGO (NUEVO) --- */}
                {hasFollowing && (
                    <div className="mb-12">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Store className="w-5 h-5 text-blue-600" />
                            Vendedores que sigues ({following.length})
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {following.map((follow) => (
                                <div key={follow.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                        {follow.seller.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={follow.seller.avatar} alt={follow.seller.storeName || "Vendedor"} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate text-sm">
                                            {follow.seller.storeName || "Vendedor"}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {follow.seller._count.products} productos
                                        </p>
                                    </div>

                                    {/* Botón Ver */}
                                    <Link
                                        href={`/vendedor/${(follow as any).sellerId}`}
                                        className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                        Ver Tienda
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- SECCIÓN 2: PRODUCTOS FAVORITOS --- */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        Productos guardados ({favorites.length})
                    </h2>

                    {hasFavorites ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {favorites.map((item) => {
                                const adaptedProduct = {
                                    id: item.id,
                                    title: item.title,
                                    price: item.price,
                                    currency: item.currency || "USD",
                                    images: [{ url: item.image }],
                                    seller: {
                                        storeName: item.seller?.name || "Vendedor",
                                        phoneNumber: item.seller?.phone || "",
                                        avatar: item.seller?.avatar || undefined,
                                    }
                                };

                                return <ProductCard key={item.id} product={adaptedProduct} />;
                            })}
                        </div>
                    ) : (
                        // Mensaje pequeño si hay vendedores pero no productos
                        <div className="p-8 bg-white rounded-xl border border-dashed border-gray-200 text-center">
                            <p className="text-gray-500 text-sm">No tienes productos guardados en favoritos.</p>
                            <Link href="/" className="text-blue-600 text-sm font-bold hover:underline mt-1 inline-block">
                                Ir a buscar ofertas
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}