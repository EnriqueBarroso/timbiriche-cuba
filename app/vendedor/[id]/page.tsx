import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { BadgeCheck, MapPin, Calendar, MessageCircle, Package, Star } from "lucide-react"; // Iconos combinados
import FollowButton from "@/components/FollowButton";
import { checkIfFollowing } from "@/lib/actions";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const seller = await prisma.seller.findUnique({ where: { id } });

  // Añade esto para evitar que metadata falle
  if (!seller) return { title: "Error de ID | LaChopin" };

  return {
    title: seller?.storeName ? `${seller.storeName} | LaChopin` : "Perfil de Vendedor",
  };
}

export default async function SellerProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();

  // 1. Buscamos vendedor y sus productos
  const seller = await prisma.seller.findUnique({
    where: { id },
    include: {
      products: {
        where: { isActive: true }, // Importante: Solo activos (rescatado del archivo viejo)
        orderBy: { createdAt: "desc" },
        include: { images: true }
      },
      _count: { select: { products: true, followers: true } }
    },
  });

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-red-50 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">🚨 Vendedor No Encontrado en Prisma</h1>
        <p className="text-xl text-gray-700">
          Prisma intentó buscar el ID: <br/> 
          <strong className="bg-white p-2 text-black rounded shadow mt-2 block">{id}</strong>
        </p>
        <p className="mt-4 text-gray-500">
          Este ID no existe en la columna 'id' de la tabla 'Seller' en Supabase, 
          o hay un problema de conexión con la base de datos correcta.
        </p>
      </div>
    );
  }

  // 2. Lógica de Social (Del archivo nuevo)
  const isFollowing = await checkIfFollowing(seller.id);
  const isMe = user?.id === seller.id;

  // 3. Preparación de datos (Rescatado y mejorado)
  const cleanPhone = seller.phoneNumber?.replace(/\D/g, '') || '';
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${seller.storeName}, vi tu tienda en LaChopin.`)}`
    : '#';
  
  const avatarUrl = seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.storeName || 'V')}&background=random&size=200`;
  
  // Cálculo del año (Rescatado del archivo viejo)
  const joinedYear = seller.createdAt
    ? new Date(seller.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- HEADER DEL PERFIL --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative"></div>
        
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start -mt-12">
            
            {/* Avatar con Badge */}
            <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={avatarUrl} 
                    alt={seller.storeName || "Tienda"} 
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-lg object-cover bg-white" 
                />
                 {seller.isVerified && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white" title="Tienda Verificada">
                        <BadgeCheck className="w-5 h-5" />
                    </div>
                )}
            </div>

            {/* Info y Acciones */}
            <div className="flex-1 mt-2 md:mt-14 w-full text-center md:text-left">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {seller.storeName || "Usuario de LaChopin"}
                        </h1>
                        
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-600">
                            {/* Eliminé la valoración falsa estática, mejor dejarlo limpio hasta tener sistema de reviews real */}
                            <span className="flex items-center gap-1">
                                <MapPin size={16} /> La Habana
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={16} /> Desde {joinedYear}
                            </span>
                             <span className="flex items-center gap-1">
                                <Package size={16} /> {seller._count.products} productos
                            </span>
                             <span className="flex items-center gap-1 font-medium text-blue-600">
                                <Star size={16} /> {seller._count.followers} seguidores
                            </span>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-0">
                        {!isMe && (
                            <>
                                <FollowButton 
                                    sellerId={seller.id}
                                    isFollowingInitial={isFollowing}
                                    isMe={false}
                                    isLoggedIn={!!user}
                                />
                                {cleanPhone && (
                                    <a 
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-600 text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        <MessageCircle size={18} /> Chat
                                    </a>
                                )}
                            </>
                        )}
                        {isMe && (
                             <div className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 border border-gray-200">
                                Vista pública de tu perfil
                             </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CATÁLOGO DE PRODUCTOS --- */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            Catálogo Disponible
        </h2>

        {seller.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {seller.products.map((product: any) => (
                    <ProductCard key={product.id} product={{
                        ...product,
                        seller: {
                            storeName: seller.storeName,
                            avatar: seller.avatar,
                            phoneNumber: seller.phoneNumber
                        }
                    }} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">Este vendedor aún no tiene publicaciones activas.</p>
            </div>
        )}
      </div>

    </div>
  );
}