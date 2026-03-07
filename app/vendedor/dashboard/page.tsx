import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function VendedorDashboardBridge() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    console.log("❌ No se encontró email en la sesión de Clerk");
    redirect("/");
  }

  // Buscamos el comercio asociado a este email
  // Usamos findFirst por si el campo email no está marcado como @unique
  const seller = await prisma.seller.findFirst({
    where: { 
      email: {
        equals: userEmail,
        mode: 'insensitive' // Ignora mayúsculas/minúsculas
      }
    },
    select: { slug: true }
  });

  if (!seller || !seller.slug) {
    console.log(`❌ No se encontró comercio para el email: ${userEmail}`);
    // Si falla, te mando al perfil normal para que no te quedes en bucle
    redirect("/perfil"); 
  }

  // 🎯 ¡Redirección al éxito!
  redirect(`/vendedor/${seller.slug}/editar`);
}