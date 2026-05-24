import { currentUser } from "@clerk/nextjs/server";
import { getSellerByEmail } from "@/lib/api";
import { redirect } from "next/navigation";
import VenderForm from "../VenderForm";

export const dynamic = "force-dynamic";

export default async function VenderPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const email = user.emailAddresses[0].emailAddress;
  const seller = await getSellerByEmail(email);

  if (!seller || !seller.phoneNumber) redirect("/perfil");

  return <VenderForm />;
}