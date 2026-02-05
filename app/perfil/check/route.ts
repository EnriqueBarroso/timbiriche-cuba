// app/perfil/check/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const email = user.emailAddresses[0].emailAddress;

  try {
    // 1. USUARIO BASE (Requisito técnico para evitar error 500)
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: email },
      create: {
        id: userId,
        email: email,
      }
    });

    // 2. VENDEDOR (Datos reales)
    const seller = await prisma.seller.upsert({
      where: { email: email },
      update: {}, 
      create: {
        id: userId,
        email: email,
        storeName: user.firstName ? `Tienda de ${user.firstName}` : "Nueva Tienda",
        avatar: user.imageUrl,
        phoneNumber: "", 
        isVerified: false,
      },
      // 3. IMPORTANTE: Devolvemos los campos que el frontend necesita leer
      select: {
        id: true,
        email: true,
        storeName: true,
        phoneNumber: true, // 👈 Esto es lo que busca tu página /vender
        avatar: true,
        isVerified: true,
      }
    });

    // 4. RETORNO: Devolvemos el objeto completo (NO solo hasPhone)
    return NextResponse.json(seller);

  } catch (error) {
    console.error("Error en profile check:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}