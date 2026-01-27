// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const body = await request.json();
    
    // --- 🔍 DEBUGGING: VER QUÉ LLEGA ---
    console.log("------------------------------------------------");
    console.log("📥 DATOS RECIBIDOS EN EL SERVIDOR:");
    console.log("Título:", body.title);
    console.log("Precio:", body.price);
    console.log("Categoría:", body.category);
    console.log("Imagen URL:", body.imageUrl);
    console.log("Email Usuario:", email);
    console.log("------------------------------------------------");
    // ------------------------------------

    const { title, description, price, category, imageUrl } = body;

    // Validación estricta
    if (!title || !price || !category || !imageUrl) {
      console.log("❌ ERROR: Faltan datos obligatorios"); // <--- Log de error
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // ... (El resto del código de buscar vendedor y crear producto sigue igual)
    let seller = await prisma.seller.findUnique({ where: { email: email } });

    if (!seller) {
      seller = await prisma.seller.create({
        data: {
          email: email,
          storeName: user.firstName ? `${user.firstName} Store` : "Tienda Nueva",
          isVerified: true,
        },
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description: description || "",
        price: parseFloat(price) * 100,
        category,
        isActive: true,
        sellerId: seller.id,
        images: {
          create: { url: imageUrl },
        },
      },
    });

    return NextResponse.json(newProduct);

  } catch (error) {
    console.error("🔥 ERROR GRAVE EN API:", error); // <--- Log de error grave
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}