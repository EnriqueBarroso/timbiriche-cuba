import { getSellerByEmail } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function VendedorDashboardBridge() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userEmail) redirect("/");

  const seller = await getSellerByEmail(userEmail).catch(() => null);

  if (!seller?.slug) redirect("/perfil");

  redirect(`/vendedor/${seller.slug}/editar`);
}