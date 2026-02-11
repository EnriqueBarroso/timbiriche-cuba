// Así de simple debería quedar tu app/vender/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VenderForm from "./VenderForm";

export default async function VenderPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const email = user.emailAddresses[0].emailAddress;

  // Verificación de Vendedor
  const seller = await prisma.seller.findUnique({
    where: { email },
    select: { phoneNumber: true },
  });

  if (!seller || !seller.phoneNumber) {
    redirect("/perfil");
  }

  // Renderiza SIEMPRE vacío (modo crear)
  return <VenderForm />;
}