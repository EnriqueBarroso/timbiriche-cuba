// This route is superseded by the NestJS API (POST /products).
// Kept as a thin proxy so existing callers still work.
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSellerByEmail, createProduct } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const body = await request.json();
    const { title, description, price, category, imageUrl } = body;

    if (!title || !price || !category || !imageUrl) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const seller = await getSellerByEmail(email);
    if (!seller) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 });
    }

    const { getToken } = await auth();
    const token = await getToken();
    const result = await createProduct({
      title,
      description: description || "",
      price: parseFloat(price) * 100,
      category,
      sellerId: seller.id,
      images: [imageUrl],
    }, token ?? undefined);

    return NextResponse.json(result.product);
  } catch (error) {
    console.error("🔥 ERROR EN API /products:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
