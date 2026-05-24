import { getProductById, getSellerByEmail } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import EditForm from "@/components/EditForm";
import FoodEditForm from "@/components/FoodEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
  const user = await currentUser();
  if (!user) return redirect("/");

  const { id } = await params;
  const userEmail = user.emailAddresses[0]?.emailAddress;

  const [product, currentSeller] = await Promise.all([
    getProductById(id).catch(() => null),
    userEmail ? getSellerByEmail(userEmail) : null,
  ]);

  if (!product) return notFound();
  if (!currentSeller || currentSeller.id !== product.sellerId) return redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 🛡️ LA MAGIA ESTÁ AQUÍ */}
        {product.seller?.isRestaurant ? (
          <>
            <h1 className="text-xl font-black text-gray-900 mb-6 uppercase italic tracking-tighter">
              Editar Plato de Menú
            </h1>
            <FoodEditForm product={product} />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Editar Publicación
            </h1>
            <EditForm product={product} />
          </>
        )}
      </div>
    </div>
  );
}