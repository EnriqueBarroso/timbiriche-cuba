import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PenLine } from "lucide-react";
// Importamos el formulario que acabamos de revisar
import EditForm from "@/components/EditForm";

// 1. Definimos las Props correctamente
interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
    // 2. Esperamos a que los parámetros estén listos (Next.js 15+)
    const { id } = await params;

    const user = await currentUser();

    if (!user) return redirect("/sign-in");

    // 3. Buscar Producto
    const product = await prisma.product.findUnique({
        where: { id },
        include: { seller: true, images: true }
    });

    // 4. Seguridad: Si no es tuyo, fuera.
    if (!product || !product.seller || product.seller.email !== user.emailAddresses[0].emailAddress) {
        return redirect("/"); // Si falla algo, te manda a la Home
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 pb-32">
            <div className="max-w-2xl mx-auto">

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <PenLine className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Editar Publicación</h1>
                </div>

                {/* Renderizamos el formulario */}
                <EditForm product={product} />

            </div>
        </div>
    );
}