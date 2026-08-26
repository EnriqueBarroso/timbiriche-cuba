import { currentUser } from "@clerk/nextjs/server";
import { getBusinessByOwnerId } from "@/lib/api";
import { redirect } from "next/navigation";
import VenderForm from "../VenderForm";

export const dynamic = "force-dynamic";

export default async function VenderPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const business = await getBusinessByOwnerId(user.id).catch(() => null);

  if (!business || !business.phoneNumber) redirect("/perfil");

  return <VenderForm />;
}