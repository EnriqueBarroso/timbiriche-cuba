import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle, Edit, Trash2, MapPin, Wallet, Info, Eye } from 'lucide-react' // Añadimos Eye
import ProductImageGallery from '@/components/ProductImageGallery'
import FavoriteButton from "@/components/FavoriteButton"
import ShareButton from "@/components/ShareButton"
import FollowButton from "@/components/FollowButton"
import ProductJsonLd from "@/components/ProductJsonLd"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { deleteProduct, checkIfFollowing } from '@/lib/actions'
import { formatPrice } from '@/lib/utils'

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>
}

// ✅ METADATA COMPLETA - LACHOPIN
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, seller: true },
  });

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const title = product.title;
  const priceText = formatPrice(product.price, product.currency);
  const description = product.description
    ? `${priceText} — ${product.description.slice(0, 140)}`
    : `${priceText} — Disponible en LaChopin`;
  const imageUrl = product.images[0]?.url || "/opengraph-image.png";
  const productUrl = `https://www.lachopin.com/product/${product.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${title} — ${priceText}`,
      description,
      url: productUrl,
      siteName: "LaChopin",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${priceText}`,
      description,
      images: [imageUrl],
    },
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

  const isOwner = user?.emailAddresses[0]?.emailAddress === product.seller?.email;

  // 👇 LÓGICA DE SUPPLY HACKING: Contador de vistas real
  // Solo incrementamos si el que mira NO es el dueño del anuncio
  if (!isOwner) {
    await prisma.product.update({
      where: { id: id },
      data: { views: { increment: 1 } }
    });
  }

  const rawPhone = product.seller?.phoneNumber || '';
  const phone = rawPhone.replace(/\D/g, '');
  const hasPhone = phone.length >= 8;
  const whatsappUrl = hasPhone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, vi *${product.title}* en LaChopin. Me interesa comprarlo.`)}`
    : '#';

  const sellerName = product.seller?.storeName || 'Vendedor LaChopin';
  const avatarUrl = product.seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random`;

  const currency = product.currency || "USD";

  const favoriteData = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.images[0]?.url || "/placeholder.jpg",
    currency: currency,
    seller: product.seller ? {
      name: sellerName,
      phone: rawPhone,
      avatar: avatarUrl
    } : undefined
  };

  const isFollowing = await checkIfFollowing(product.sellerId || "");
  const isLoggedIn = !!user;
  const currentUserId = user?.id;

  // Datos de Zelle
  const acceptsZelle = product.seller?.acceptsZelle || false;
  const zelleEmail = product.seller?.zelleEmail || '';

  return (
    <div className="min-h-screen pb-32 bg-gray-50">

      {/* ✅ JSON-LD STRUCTURED DATA */}
      <ProductJsonLd
        name={product.title}
        description={product.description}
        price={product.price}
        currency={currency}
        imageUrl={product.images[0]?.url || "/opengraph-image.png"}
        url={`https://www.lachopin.com/product/${product.id}`}
        sellerName={sellerName}
        isSold={product.isSold}
      />

      {/* 1. Navbar Transparente */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
        <Link href="/" className="bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm text-gray-700 hover:bg-white pointer-events-auto transition-all">
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto md:pt-6 md:px-4">

        {/* 2. Galería */}
        <div className="md:rounded-3xl overflow-hidden shadow-sm bg-white">
          <ProductImageGallery images={product.images.map(img => img.url)} />
        </div>

        <div className="p-4 md:p-0 mt-4">
          {/* Título y Precio */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600">
                  {formatPrice(product.price, currency)}
                </span>
                {acceptsZelle && (
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100 flex items-center gap-1">
                    <Wallet size={12} /> Acepta Zelle
                  </span>
                )}
              </div>
              
              {/* Contador de vistas (Opcional: Social Proof para el comprador) */}
              <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                <Eye size={14} />
                <span>{product.views} visitas</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} />
              <span>La Habana, Cuba</span>
              <span className="mx-1">•</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* 3. Sección Vendedor */}
          <div className="p-5 mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4">
              <Link href={`/vendedor/${product.sellerId}`} className="flex items-center flex-1 gap-4 group">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt={sellerName} className="object-cover border border-gray-200 rounded-full w-14 h-14 group-hover:ring-2 group-hover:ring-blue-100 transition-all" />
                  {product.seller?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{sellerName}</h3>
                  <p className="text-xs text-gray-500">Ver perfil de la tienda</p>
                </div>
              </Link>

              {!isOwner && product.sellerId && (
                <div className="shrink-0">
                  <FollowButton
                    sellerId={product.sellerId}
                    isFollowingInitial={isFollowing}
                    isMe={currentUserId === product.sellerId}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              )}
            </div>
          </div>

          {/* BLOQUE DE ZELLE */}
          {!isOwner && acceptsZelle && (
            <div className="p-5 mb-4 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200 border border-purple-500 text-white animate-in zoom-in-95 duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg">Paga con Zelle</h4>
                  <p className="text-sm text-purple-100 mt-1 leading-relaxed">
                    Este vendedor acepta pagos directos por Zelle.
                  </p>
                  <div className="mt-4 bg-white/10 p-3 rounded-xl border border-white/20">
                    <p className="text-xs uppercase font-bold text-purple-200 mb-1">Cuenta Zelle:</p>
                    <p className="text-lg font-mono font-bold select-all">{zelleEmail}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-purple-100 bg-black/10 p-2 rounded-lg">
                    <Info size={14} />
                    <span>Importante: Contacta primero por WhatsApp para confirmar stock y envío.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-3">Detalles del artículo</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Sticky Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-[100]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)', paddingTop: '12px', paddingLeft: '12px', paddingRight: '12px' }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-3">

          {isOwner ? (
            <>
              <form action={async () => { "use server"; await deleteProduct(product.id); }} className="flex-1">
                <button className="w-full bg-red-50 text-red-600 h-12 md:h-14 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-200 active:bg-red-100 transition-colors">
                  <Trash2 size={20} />
                  <span className="text-sm md:text-base">Borrar</span>
                </button>
              </form>
              <Link href={`/editar/${product.id}`} className="flex-1">
                <button className="w-full bg-gray-100 text-gray-800 h-12 md:h-14 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-gray-200 transition-colors">
                  <Edit size={20} />
                  <span className="text-sm md:text-base">Editar</span>
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="shrink-0 flex items-center justify-center h-12 w-12 md:h-14 md:w-14 bg-gray-50 border border-gray-200 rounded-full active:bg-gray-100 transition-colors">
                <FavoriteButton product={favoriteData} />
              </div>

              <div className="shrink-0 flex items-center justify-center h-12 w-12 md:h-14 md:w-14 bg-gray-50 border border-gray-200 rounded-full active:bg-gray-100 transition-colors">
                <ShareButton title={product.title} text={`Mira esto en LaChopin: ${product.title}`} />
              </div>

              {hasPhone ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white h-12 md:h-14 rounded-full font-bold flex items-center justify-center gap-1.5 md:gap-2 shadow-lg shadow-green-200/50 active:scale-95 transition-all"
                >
                  <MessageCircle size={22} fill="white" className="text-white shrink-0" />
                  <span className="text-sm md:text-base">{acceptsZelle ? "Pagar con Zelle" : "Contactar"}</span>
                </a>
              ) : (
                <button disabled className="flex-1 bg-gray-100 text-gray-400 h-12 md:h-14 rounded-full font-bold flex items-center justify-center gap-1.5 md:gap-2 cursor-not-allowed border border-gray-200">
                  <MessageCircle size={22} className="shrink-0" />
                  <span className="text-sm md:text-base">Sin WhatsApp</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}