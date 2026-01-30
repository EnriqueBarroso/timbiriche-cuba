import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import EditForm from "@/components/EditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
  // 1. Verificamos Auth
  const user = await currentUser();
  if (!user) return redirect("/");

  const { id } = await params;

  // 2. Buscamos el producto
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, seller: true }
  });

  // 3. Validaciones de Seguridad
  if (!product) return notFound();
  
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (product.seller?.email !== userEmail) {
    // Si intentas editar algo que no es tuyo -> Home
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Publicación</h1>
        
        {/* Renderizamos el formulario con los datos cargados */}
        <EditForm product={product} />
      </div>
    </div>
  );
}