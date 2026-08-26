import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getBusinessBySlug, getBusinessByOwnerId, getBusinessProducts } from "@/lib/api";
import { isAdmin } from "@/lib/utils";
import { ArrowLeft, Plus } from "lucide-react";
import ProductsList from "./ProductsList";

const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BusinessProductsPage({ params }: Props) {
  const { slug } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const [business, currentBusiness] = await Promise.all([
    getBusinessBySlug(slug).catch(() => null),
    user ? getBusinessByOwnerId(user.id).catch(() => null) : Promise.resolve(null),
  ]);

  if (!business) notFound();

  // Mismo patrón de ownership que /vendedor/[slug]/editar: el dueño del
  // negocio o el admin de la plataforma, nadie más.
  if (!isAdmin(userEmail) && currentBusiness?.id !== business.id) {
    redirect("/");
  }

  const products = await getBusinessProducts(business.id).catch(() => []);

  return (
    <main className="min-h-screen flex justify-center font-sans" style={{ backgroundColor: CREAM }}>
      <div className="w-full max-w-md relative pb-10" style={{ backgroundColor: CREAM }}>
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <Link
            href={`/vendedor/${slug}`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-black/10 text-gray-600 shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 truncate">
              {business.storeName}
            </p>
            <h1 className="text-xl font-black text-gray-900">Mis productos</h1>
          </div>
        </div>

        <div className="px-5 mb-5">
          <Link
            href={`/vendedor/${slug}/productos/nuevo`}
            className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-black text-base shadow-lg active:scale-[0.98] transition-all hover:brightness-105"
            style={{ backgroundColor: TERRACOTTA }}
          >
            <Plus size={20} /> Agregar producto
          </Link>
        </div>

        <ProductsList products={products} slug={slug} />
      </div>
    </main>
  );
}
