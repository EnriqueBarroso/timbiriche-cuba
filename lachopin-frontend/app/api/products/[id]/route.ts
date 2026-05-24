// Thin proxy to the NestJS DELETE /products/:id endpoint.
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSellerByEmail, getProductById, deleteProduct } from "@/lib/api";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const email = user.emailAddresses[0].emailAddress;

    const [product, seller] = await Promise.all([
      getProductById(id).catch(() => null),
      getSellerByEmail(email),
    ]);

    if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    if (!seller || product.sellerId !== seller.id) {
      return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
    }

    const { getToken } = await auth();
    const token = await getToken();
    await deleteProduct(id, token ?? undefined);
    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al borrar:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
