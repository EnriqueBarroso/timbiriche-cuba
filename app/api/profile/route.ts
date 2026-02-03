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
    const { storeName, phoneNumber, avatar } = body;

    // ✅ VALIDACIONES
    if (!storeName || !phoneNumber) {
      return NextResponse.json(
        { error: "Nombre de tienda y teléfono son obligatorios" },
        { status: 400 }
      );
    }

    // ✅ Validar teléfono (mínimo 8 dígitos)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      return NextResponse.json(
        { error: "El teléfono debe tener al menos 8 dígitos" },
        { status: 400 }
      );
    }

    // ✅ UPSERT: Crear o actualizar en una sola operación
    const seller = await prisma.seller.upsert({
      where: { email },
      update: {
        storeName,
        phoneNumber,
        ...(avatar && { avatar }), // Solo actualiza avatar si viene en el body
      },
      create: {
        id: user.id, // ← Importante: mantener consistencia con Clerk
        email,
        storeName,
        phoneNumber,
        avatar: avatar || user.imageUrl,
        isVerified: false,
      },
    });

    return NextResponse.json({ success: true, seller });

  } catch (error) {
    console.error("Error al guardar perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}