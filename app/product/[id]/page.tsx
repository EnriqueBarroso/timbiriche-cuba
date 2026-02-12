import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle, Edit, Trash2, MapPin } from 'lucide-react'
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

// ✅ METADATA COMPLETA
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
        : `${priceText} — Disponible en Timbiriche Cuba`;
    const imageUrl = product.images[0]?.url || "/opengraph-image.png";
    const productUrl = `https://timbiriche-cuba.vercel.app/product/${product.id}`;

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
            siteName: "Timbiriche Cuba",
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

    const rawPhone = product.seller?.phoneNumber || '';
    const phone = rawPhone.replace(/\D/g, '');
    const hasPhone = phone.length >= 8;
    const whatsappUrl = hasPhone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, vi *${product.title}* en Timbiriche.`)}`
        : '#';

    const sellerName = product.seller?.storeName || 'Vendedor Timbiriche';
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

    return (
        <div className="min-h-screen pb-32 bg-gray-50">

            {/* ✅ JSON-LD STRUCTURED DATA */}
            <ProductJsonLd
                name={product.title}
                description={product.description}
                price={product.price}
                currency={currency}
                imageUrl={product.images[0]?.url || "/opengraph-image.png"}
                url={`https://timbiriche-cuba.vercel.app/product/${product.id}`}
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

                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-blue-600">
                                {formatPrice(product.price, currency)}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={16} />
                            <span>La Habana, Cuba</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* 3. Sección Vendedor */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={avatarUrl} alt={sellerName} className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                                {product.seller?.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Link href={`/vendedor/${product.sellerId}`} className="hover:underline hover:text-blue-600 transition-colors">
                                            <h3 className="font-bold text-gray-900 text-lg">{sellerName}</h3>
                                        </Link>
                                        <p className="text-xs text-gray-500">Vendedor en Timbiriche</p>
                                    </div>

                                    {!isOwner && product.sellerId && (
                                        <FollowButton
                                            sellerId={product.sellerId}
                                            isFollowingInitial={isFollowing}
                                            isMe={currentUserId === product.sellerId}
                                            isLoggedIn={isLoggedIn}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-3">Detalles</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="max-w-4xl mx-auto flex items-center gap-3">

                    {isOwner ? (
                        <>
                            <form action={async () => { "use server"; await deleteProduct(product.id); }} className="flex-1">
                                <button className="w-full bg-red-50 text-red-600 h-12 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-200">
                                    <Trash2 size={20} /> Borrar
                                </button>
                            </form>
                            <Link href={`/editar/${product.id}`} className="flex-1">
                                <button className="w-full bg-gray-100 text-gray-800 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Edit size={20} /> Editar
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="shrink-0">
                                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full border border-gray-200">
                                    <FavoriteButton product={favoriteData} />
                                </div>
                            </div>

                            <div className="shrink-0">
                                <ShareButton title={product.title} text={`Mira esto en Timbiriche: ${product.title}`} />
                            </div>

                            {hasPhone ? (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all"
                                >
                                    <MessageCircle size={22} fill="white" className="text-white" />
                                    <span>Contactar</span>
                                </a>
                            ) : (
                                <button disabled className="flex-1 bg-gray-200 text-gray-500 h-12 rounded-full font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                    <MessageCircle size={22} />
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