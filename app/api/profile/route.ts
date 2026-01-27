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
    
    console.log("📥 Recibiendo datos para:", email);
    const { storeName, phoneNumber } = body;

    // Buscamos si existe
    const existingSeller = await prisma.seller.findUnique({
      where: { email },
    });

    let result;

    if (existingSeller) {
      // --- CASO A: ACTUALIZAR ---
      result = await prisma.seller.update({
        where: { email },
        data: {
          storeName,
          phoneNumber, 
          // ❌ BORRAMOS userId: user.id (Esto causaba el error)
        },
      });
    } else {
      // --- CASO B: CREAR ---
      result = await prisma.seller.create({
        data: {
          email,
          storeName: storeName || "Vendedor Nuevo",
          phoneNumber,
          // ❌ BORRAMOS userId: user.id AQUÍ TAMBIÉN
        },
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("❌ ERROR AL GUARDAR PERFIL:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}