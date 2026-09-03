import { currentUser } from "@clerk/nextjs/server";
import { getBusinessByOwnerId } from "@/lib/api";
import { redirect } from "next/navigation";
import NuevoPlatoForm from "./NuevoPlatoForm";

export const dynamic = "force-dynamic";

export default async function NuevoPlatoPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const business = await getBusinessByOwnerId(user.id).catch(() => null);
  if (!business) redirect("/perfil");

  return <NuevoPlatoForm />;
}
