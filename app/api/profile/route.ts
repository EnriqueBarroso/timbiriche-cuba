// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const body = await request.json();
    const { storeName, phoneNumber } = body;

    // Buscamos si existe
    const existingSeller = await prisma.seller.findUnique({
      where: { email },
    });

    let result;

    if (existingSeller) {
      // Actualizar vendedor existente
      result = await prisma.seller.update({
        where: { email },
        data: {
          storeName,
          phoneNumber,
        },
      });
    } else {
      // Crear nuevo vendedor
      result = await prisma.seller.create({
        data: {
          email,
          storeName: storeName || "Vendedor Nuevo",
          phoneNumber,
        },
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error al guardar perfil:", error); // ✅ MANTENER (console.error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}