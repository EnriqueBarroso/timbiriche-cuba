import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/api";
import BusinessStorefront from "@/components/BusinessStorefront";

interface VendedorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VendedorProfilePage({ params }: VendedorPageProps) {
  const { slug } = await params;

  const business = await getBusinessBySlug(slug).catch(() => null);
  if (!business) notFound();

  return <BusinessStorefront business={business} />;
}
