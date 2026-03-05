import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UtensilsCrossed, Star, MapPin, Clock, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EatsHubPage() {
    // Consultamos SOLO a los vendedores que son restaurantes
    const restaurants = await prisma.seller.findMany({
        where: {
            isRestaurant: true,
            // isVerified: true // Opcional: Descomenta esto si solo quieres mostrar restaurantes verificados
        },
        include: {
            _count: { select: { products: true } }
        },
        orderBy: { rating: 'desc' } // Los mejores valorados primero
    });

    return (
        <main className="min-h-screen bg-gray-50 pb-20">

            {/* Header VIP estilo LaChopin Eats */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 pb-16 pt-12 px-4 rounded-b-[2.5rem] shadow-lg">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-4">
                        <UtensilsCrossed className="text-white w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
                        LaChopin <span className="bg-white text-red-600 px-3 py-1 rounded-xl">Eats</span>
                    </h1>
                    <p className="text-red-50 text-lg max-w-xl font-medium">
                        Tus platos favoritos de los mejores restaurantes locales. Pide rápido, sin registros y directo al WhatsApp.
                    </p>
                </div>
            </div>

            {/* Grid de Restaurantes */}
            <div className="max-w-6xl mx-auto px-4 -mt-8">
                {restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((restaurant) => {

                            // 👇 AQUÍ ESTABA EL ERROR: Ahora apunta al perfil de presentación, NO al menú directo
                            const profileUrl = `/vendedor/${restaurant.slug || restaurant.id}`;

                            // Intentamos buscar una foto de perfil/avatar válida
                            const restaurantData = restaurant as any;

                            const avatar = restaurantData.profileImage ||
                                restaurantData.logo ||
                                restaurantData.avatar || // Por si acaso se llama avatar
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.storeName)}&background=D32F2F&color=fff`;
                            // 👇 NUEVO: Verificamos si tiene imagen de portada
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const coverImage = (restaurant as any).coverImage;

                            return (
                                <Link
                                    href={profileUrl}
                                    key={restaurant.id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                                >
                                    {/* Banner/Portada del Restaurante */}
                                    <div className="h-28 w-full relative bg-gray-900">
                                        {coverImage ? (
                                            <img src={coverImage} alt="Portada" className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                                        )}

                                        {/* Avatar superpuesto */}
                                        <div className="absolute -bottom-6 left-6">
                                            <img
                                                src={avatar}
                                                alt={restaurant.storeName}
                                                className="w-16 h-16 rounded-xl border-4 border-white shadow-sm object-cover bg-white"
                                            />
                                        </div>
                                        {/* Rating en la esquina */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-gray-800 shadow-sm">
                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                            {restaurant.rating.toFixed(1)}
                                        </div>
                                    </div>

                                    {/* Info del Restaurante */}
                                    <div className="pt-10 pb-5 px-6 flex-1 flex flex-col">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                                            {restaurant.storeName}
                                        </h2>

                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1"><Clock size={14} /> 20-30 min</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> Local</span>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                            <span className="text-sm font-medium text-gray-500">
                                                {restaurant._count.products} platos
                                            </span>
                                            <div className="bg-red-50 text-red-600 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100 mt-8">
                        <span className="text-6xl mb-4 block">🍕</span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aún no hay restaurantes</h3>
                        <p className="text-gray-500">Sé el primero en vender tu comida en LaChopin Eats.</p>
                    </div>
                )}
            </div>
        </main>
    );
}