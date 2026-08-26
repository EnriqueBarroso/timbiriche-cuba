import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getBusinessBySlug, getBusinessByOwnerId } from "@/lib/api";
import { isAdmin } from "@/lib/utils";
import NewProductForm from "./NewProductForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewProductPage({ params }: Props) {
  const { slug } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const [business, currentBusiness] = await Promise.all([
    getBusinessBySlug(slug).catch(() => null),
    user ? getBusinessByOwnerId(user.id).catch(() => null) : Promise.resolve(null),
  ]);

  if (!business) notFound();

  // Mismo patrón de ownership que /vendedor/[slug]/productos y /editar.
  if (!isAdmin(userEmail) && currentBusiness?.id !== business.id) {
    redirect("/");
  }

  return <NewProductForm slug={slug} />;
}
