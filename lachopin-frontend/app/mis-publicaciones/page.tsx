import { currentUser } from "@clerk/nextjs/server";
import { getBusinessByOwnerId } from "@/lib/api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Ruta retirada: la gestión de catálogo vive ahora en /vendedor/[slug]/productos.
// Se mantiene como redirect (en vez de borrarse) porque varios flujos activos
// todavía enlazan aquí (/vender/nuevo-plato, /editar/[id], y los botones
// "Entrar" del Navbar vía forceRedirectUrl) — así ningún enlace existente
// queda roto.
export default async function MyProductsRedirectPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const business = await getBusinessByOwnerId(user.id).catch(() => null);

  if (!business || !business.phoneNumber) {
    redirect("/perfil?returnTo=/mis-publicaciones");
  }

  redirect(`/vendedor/${business.slug}/productos`);
}
