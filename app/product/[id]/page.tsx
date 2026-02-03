import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle, BadgeCheck, Star, Clock, Calendar, Edit, Trash2 } from 'lucide-react'
import ProductImageGallery from '@/components/ProductImageGallery'
import FavoriteButton from "@/components/FavoriteButton"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { deleteProduct } from '@/lib/actions'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, seller: true },
  });

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.title} | Timbiriche 🇨🇺`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const user = await currentUser();

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { images: true, seller: true }
  })

  if (!product) return notFound()

  // Verificamos si el usuario actual es el dueño
  const isOwner = user?.emailAddresses[0]?.emailAddress === product.seller?.email;

  const imagesList = product.images.map(img => img.url)
  const priceDollars = (product.price / 100).toFixed(2)

  const rawPhone = product.seller?.phoneNumber || '';
  const phone = rawPhone.replace(/\D/g, '');
  const hasPhone = phone.length > 0;
  const whatsappUrl = hasPhone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, vi tu anuncio *${product.title}* en Timbiriche y me interesa.`)}`
    : '#';

  const sellerName = product.seller?.storeName || 'Vendedor';
  // Usamos img normal para avatares externos para evitar configurar next.config.js ahora mismo
  const avatarUrl = product.seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random`;

  const memberSince = product.seller?.createdAt
    ? new Date(product.seller.createdAt).getFullYear()
    : new Date().getFullYear();

  const favoriteData = {
    id: product.id,
    title: product.title,
    price: product.price / 100,
    image: product.images[0]?.url || "/placeholder.jpg",
    currency: "USD",
    seller: product.seller ? {
      name: product.seller.storeName,
      phone: product.seller.phoneNumber || "",
      avatar: product.seller.avatar || undefined
    } : undefined
  };

  return (
    <div className="min-h-screen pb-28 md:pb-32 bg-gray-50">

      {/* Header Sticky */}
      <div className="bg-white sticky top-0 z-20 px-3 md:px-4 py-2.5 md:py-3 shadow-sm flex items-center gap-3 md:gap-4 border-b border-gray-100">
        <Link href={isOwner ? "/mis-publicaciones" : "/"} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <span className="font-semibold text-sm md:text-base text-gray-900 truncate flex-1">
          {isOwner ? "Gestionar Producto" : "Detalles"}
        </span>
      </div>

      <div className="max-w-4xl mx-auto md:p-4 lg:py-8">

        {/* Aviso para el dueño */}
        {isOwner && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 mx-4 md:mx-0 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm">Vista de Propietario</h3>
              <p className="text-blue-700 text-xs md:text-sm mt-1">
                Así ven los compradores tu publicación. Usa los botones de abajo para gestionarla.
              </p>
            </div>
          </div>
        )}

        {/* Galería */}
        <div className="md:rounded-2xl overflow-hidden mb-4">
          <ProductImageGallery images={imagesList} />
        </div>

        {/* Título y Precio */}
        <div className="bg-white md:rounded-2xl p-4 md:p-6 shadow-sm border-t border-b md:border border-gray-100 mb-4 relative">

          {!isOwner && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
              <FavoriteButton product={favoriteData} />
            </div>
          )}

          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight pr-12">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600">
              ${priceDollars}
            </span>
            <span className="text-sm font-medium text-gray-500">USD</span>
          </div>
        </div>

        {/* Vendedor */}
        {!isOwner && (
          <div className="bg-white md:rounded-2xl p-4 md:p-6 shadow-sm border-t border-b md:border border-gray-100 mb-4 hover:shadow-md transition-shadow">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Vendedor</h2>

            <Link href={product.seller ? `/vendedor/${product.seller.id}` : '#'} className="group block">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                {/* Usamos <img> estándar para avatares externos dinámicos */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt="Seller"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-500 transition-colors shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base md:text-lg text-gray-900 group-hover:text-blue-600 transition-colors underline decoration-transparent group-hover:decoration-blue-600 truncate">
                      {sellerName}
                    </span>
                    {product.seller?.isVerified && (
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold shrink-0">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Verificado</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900">4.8</span>
                    <span className="text-xs ml-1 text-blue-600 font-medium group-hover:underline">Ver productos</span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-xl p-2.5 md:p-3 border border-gray-100">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">Responde</p>
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">~ 1 hora</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-xl p-2.5 md:p-3 border border-gray-100">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">Desde</p>
                  <p className="text-xs md:text-sm font-medium text-gray-900">{memberSince}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Descripción */}
        <div className="bg-white md:rounded-2xl p-4 md:p-6 shadow-sm border-t border-b md:border border-gray-100">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Descripción</h2>
          <p className="text-gray-700 text-sm md:text-base whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
        </div>

      </div>

      {/* Footer Flotante */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)] z-40">
        <div className="max-w-4xl mx-auto flex gap-2 md:gap-3">

          {isOwner ? (
            <>
              <form action={async () => {
                "use server";
                await deleteProduct(product.id);
              }} className="flex-1">
                <button
                  type="submit"
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-red-200 h-12 md:h-14 text-sm md:text-base"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  Eliminar
                </button>
              </form>

              <Link href={`/editar/${product.id}`} className="flex-1">
                <button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl flex items-center justify-center gap-2 h-12 md:h-14 text-sm md:text-base transition-all active:scale-[0.98]">
                  <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  Editar
                </button>
              </Link>
            </>
          ) : (
            <>

              {hasPhone ? (
                // 🔥 AQUÍ ESTABA EL ERROR: Faltaba la etiqueta <a> de apertura
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg h-12 md:h-14 text-sm md:text-base"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="truncate">Contactar Vendedor</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-300 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed h-12 md:h-14 text-sm md:text-base"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Sin Teléfono</span>
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}