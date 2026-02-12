import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import FavoritesClient from "@/components/FavoritesClient"; // Importamos el componente de arriba

// Esto es importante para que la página no se cachee y muestre siempre los follows actualizados
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await currentUser();

  // Si no hay usuario logueado, pasamos lista vacía
  // (No redirigimos porque FavoritesContext funciona sin login en localStorage)
  let following: any[] = [];

  if (user) {
    following = await prisma.follower.findMany({
      where: { followerId: user.id },
      include: { 
        seller: {
          select: {
            storeName: true,
            avatar: true,
            _count: {
              select: { products: true }
            }
          }
        } 
      },
    });
  }

  // Renderizamos el cliente pasando los datos del servidor
  return <FavoritesClient following={following} />;
}