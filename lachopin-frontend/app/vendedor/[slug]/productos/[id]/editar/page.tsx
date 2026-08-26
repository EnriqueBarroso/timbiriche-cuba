import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getBusinessBySlug, getBusinessByOwnerId, getProductById } from "@/lib/api";
import { isAdmin } from "@/lib/utils";
import EditProductForm from "./EditProductForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { slug, id } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const [business, currentBusiness, product] = await Promise.all([
    getBusinessBySlug(slug).catch(() => null),
    user ? getBusinessByOwnerId(user.id).catch(() => null) : Promise.resolve(null),
    getProductById(id).catch(() => null),
  ]);

  if (!business || !product) notFound();

  // Mismo patrón de ownership que /vendedor/[slug]/productos y /editar.
  if (!isAdmin(userEmail) && currentBusiness?.id !== business.id) {
    redirect("/");
  }

  // El producto debe pertenecer a este negocio (evita editar un producto
  // ajeno manipulando el id en la URL, aunque la acción también lo valida).
  if (product.businessId !== business.id) notFound();

  return <EditProductForm slug={slug} product={product} />;
}
