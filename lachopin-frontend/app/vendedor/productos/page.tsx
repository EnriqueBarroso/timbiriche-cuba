import { getBusinessByOwnerId } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Puente sin slug: resuelve el negocio del usuario autenticado y redirige
// a /vendedor/[slug]/productos. Mismo patrón que /vendedor/dashboard.
export default async function MyProductsBridge() {
  const user = await currentUser();
  if (!user) redirect("/");

  const business = await getBusinessByOwnerId(user.id).catch(() => null);
  if (!business?.slug) redirect("/perfil");

  redirect(`/vendedor/${business.slug}/productos`);
}
