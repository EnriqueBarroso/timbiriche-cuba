// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary para borrar las fotos también
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15: params es una Promesa
) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    // 1. Verificar que el producto existe y pertenece al usuario
    const product = await prisma.product.findUnique({
      where: { id },
      include: { seller: true }
    });

    if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

    // Seguridad: Solo el dueño puede borrar
    // Nota: Comparamos email porque es lo que vinculamos, o el userId si lo guardamos
    const email = user.emailAddresses[0].emailAddress;
    if (product.seller?.email !== email) {
      return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
    }

    // 2. Borrar de la base de datos
    await prisma.product.delete({
      where: { id },
    });

    // (Opcional) Aquí podrías borrar las imágenes de Cloudinary si quisieras ahorrar espacio
    
    return NextResponse.json({ message: "Producto eliminado" });

  } catch (error) {
    console.error("Error al borrar:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}