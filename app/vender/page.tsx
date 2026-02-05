import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VenderForm from "./VenderForm";

export default async function VenderPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const user = await currentUser();
  if (!user) return redirect("/");

  const email = user.emailAddresses[0].emailAddress;

  // 1. Verificamos Vendedor
  const seller = await prisma.seller.findUnique({
    where: { email },
    select: { phoneNumber: true },
  });

  if (!seller || !seller.phoneNumber) {
    redirect("/perfil");
  }

  // 2. LÓGICA DE EDICIÓN
  // Si en la URL viene ?edit=123, buscamos ese producto
  let productToEdit = null;

  if (searchParams.edit) {
    productToEdit = await prisma.product.findUnique({
      where: {
        id: searchParams.edit,
        seller: { email: email } // ¡Seguridad! Solo sus productos
      },
      include: { images: true }
    });
  }

  // 3. Renderizamos el formulario (con o sin datos)
  return <VenderForm initialProduct={productToEdit} />;
}