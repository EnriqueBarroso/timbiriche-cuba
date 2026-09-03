import { currentUser } from "@clerk/nextjs/server";
import { getBusinessByOwnerId } from "@/lib/api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Ruta retirada: publicar productos vive ahora en /vendedor/[slug]/productos/nuevo.
// Se mantiene como redirect (en vez de borrarse) por si algún enlace o marcador
// antiguo sigue apuntando aquí.
export default async function VenderNuevoRedirectPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const business = await getBusinessByOwnerId(user.id).catch(() => null);

  if (!business?.slug) redirect("/perfil");

  redirect(`/vendedor/${business.slug}/productos/nuevo`);
}
