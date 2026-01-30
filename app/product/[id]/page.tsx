import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle, BadgeCheck, Star, Clock, Calendar, Edit, Trash2 } from 'lucide-react'
import ProductImageGallery from '@/components/ProductImageGallery'
import AddToCartButton from '@/components/AddToCartButton'
import FavoriteButton from "@/components/FavoriteButton"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server" // 👈 1. Importamos para saber quién ve la página
import { deleteProduct } from '@/lib/actions' // 👈 Importamos acción de borrar

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
  const user = await currentUser(); // 👈 2. Obtenemos usuario actual

  // Buscamos producto
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { images: true, seller: true }
  })

  if (!product) return notFound()

  // 3. VERIFICAMOS SI ES EL DUEÑO
  // Comparamos el email del vendedor con el email del usuario logueado
  const isOwner = user?.emailAddresses[0]?.emailAddress === product.seller?.email;

  // Preparar datos visuales
  const imagesList = product.images.map(img => img.url)
  const priceDollars = (product.price / 100).toFixed(2)

  // WhatsApp Logic (Solo para compradores)
  const rawPhone = product.seller?.phoneNumber || '';
  const phone = rawPhone.replace(/\D/g, '');
  const hasPhone = phone.length > 0;
  const whatsappUrl = hasPhone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, vi tu anuncio *${product.title}* en Timbiriche y me interesa.`)}`
    : '#';

  const sellerName = product.seller?.storeName || 'Vendedor';
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
    <div className="min-h-screen pb-32 bg-gray-50">

      {/* Header Sticky */}
      <div className="bg-white sticky top-0 z-20 px-4 py-3 shadow-sm flex items-center gap-4 border-b border-gray-100">
        <Link href={isOwner ? "/mis-publicaciones" : "/"} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <span className="font-semibold text-gray-900 truncate flex-1">
          {isOwner ? "Gestionar Producto" : "Detalles del Producto"}
        </span>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:py-8">

        {/* --- AVISO SOLO PARA EL DUEÑO --- */}
        {isOwner && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm">Vista de Propietario</h3>
              <p className="text-blue-700 text-sm mt-1">
                Así ven los compradores tu publicación. Usa los botones de abajo para gestionarla.
              </p>
            </div>
          </div>
        )}

        <ProductImageGallery images={imagesList} />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 mt-4 relative">

          {/* Solo mostramos Favorito si NO es el dueño */}
          {!isOwner && (
            <div className="absolute top-6 right-6 z-10">
              <FavoriteButton product={favoriteData} />
            </div>
          )}

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight pr-12">
            {product.title}
          </h1>
          <p className="text-4xl font-extrabold text-blue-600">
            ${priceDollars}
          </p>
        </div>

        {/* Tarjeta del Vendedor (Solo si NO es el dueño) */}
        {!isOwner && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Vendedor</h2>

            <Link href={product.seller ? `/vendedor/${product.seller.id}` : '#'} className="group block">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={avatarUrl}
                  alt="Seller"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-500 transition-colors"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors underline decoration-transparent group-hover:decoration-blue-600">
                      {sellerName}
                    </span>
                    {product.seller?.isVerified && (
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                        <BadgeCheck className="w-3.5 h-3.5" /> Verificado
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

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Responde en</p>
                  <p className="text-sm font-medium text-gray-900">~ 1 hora</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Miembro desde</p>
                  <p className="text-sm font-medium text-gray-900">{memberSince}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Descripción */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed text-base">
            {product.description}
          </p>
        </div>

      </div>

      {/* --- FOOTER FLOTANTE (CAMBIA SEGÚN EL DUEÑO) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex gap-3">

          {isOwner ? (
            // --- OPCIÓN A: ERES EL DUEÑO (Botones de gestión) ---
            <>
              <form action={async () => {
                "use server";
                await deleteProduct(product.id);
                // NOTA: deleteProduct hace revalidatePath, pero aquí deberíamos redirigir
                // Idealmente la acción deleteProduct debería hacer un redirect("/mis-publicaciones") al final
              }} className="flex-1">
                <button
                  type="submit"
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-red-100 h-14"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar Publicación
                </button>
              </form>

              <Link href={`/editar/${product.id}`} className="flex-1"> {/* 👈 Envuelve el botón en un Link */}
                <button
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl flex items-center justify-center gap-2 h-14"
                >
                  <Edit className="w-5 h-5" />
                  Editar
                </button>
              </Link>
            </>
          ) : (
            // --- OPCIÓN B: ERES COMPRADOR (Botones de compra) ---
            <>
              <div className="w-16 flex-shrink-0 h-14">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <AddToCartButton product={product as any} compact={true} />
              </div>

              {hasPhone ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-200 h-14"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg">Contactar Vendedor</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-300 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed h-14"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg">Sin Teléfono</span>
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}