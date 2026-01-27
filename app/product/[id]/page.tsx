import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle, BadgeCheck, Star, Clock, Calendar } from 'lucide-react'
import ProductImageGallery from '@/components/ProductImageGallery'
import AddToCartButton from '@/components/AddToCartButton'
import { Product } from "@/types"; 
import { Metadata } from "next";

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

  const productImage = product.images[0]?.url || "/placeholder.jpg";
  const price = (product.price / 100).toFixed(2);

  return {
    title: `${product.title} - $${price} | Timbiriche 🇨🇺`,
    description: `Compra ${product.title} vendido por ${product.seller?.storeName || 'un vendedor'} en Timbiriche.`,
    openGraph: {
      title: `${product.title} ($${price})`,
      description: `Disponible en Timbiriche. Vendedor: ${product.seller?.storeName || 'Timbiriche'}`,
      images: [{ url: productImage, width: 800, height: 600, alt: product.title }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { images: true, seller: true }
  })

  if (!product) return notFound()

  const imagesList = product.images.map(img => img.url)
  const priceDollars = (product.price / 100).toFixed(2)
  
  const rawPhone = product.seller?.phoneNumber || '';
  const phone = rawPhone.replace(/\D/g, ''); 
  const hasPhone = phone.length > 0;
  
  const whatsappUrl = hasPhone 
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, vi tu anuncio *${product.title}* en Timbiriche y me interesa.`)}`
    : '#';

  const sellerName = product.seller?.storeName || 'Vendedor';
  const avatarUrl = product.seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random`;

  // --- 🛠️ ARREGLO DE LA FECHA ---
  // Si existe el vendedor, sacamos el año de su fecha de creación (createdAt).
  // Si no, ponemos el año actual.
  const memberSince = product.seller?.createdAt 
    ? new Date(product.seller.createdAt).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="min-h-screen pb-32">
      {/* Header Sticky */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm flex items-center gap-4 border-b border-gray-100">
        <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <span className="font-semibold text-gray-900 truncate flex-1">Detalles del Producto</span>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:py-8">

        {/* Galería */}
        <ProductImageGallery images={imagesList} />

        {/* Título y Precio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 mt-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {product.title}
          </h1>
          <p className="text-4xl font-extrabold text-blue-600">
            ${priceDollars}
          </p>
        </div>

        {/* Datos del Vendedor */}
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
            
            {/* 👇 AQUÍ ESTÁ EL CAMBIO VISUAL */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Miembro desde</p>
                {/* Usamos la variable dinámica */}
                <p className="text-sm font-medium text-gray-900">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed text-base">
            {product.description}
          </p>
        </div>

      </div>

      {/* Footer Flotante */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="w-16 flex-shrink-0">
             <AddToCartButton product={product as unknown as Product} compact={true} />
          </div>

          {hasPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-200"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-lg">Contactar Vendedor</span>
            </a>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-lg">Sin Teléfono</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}