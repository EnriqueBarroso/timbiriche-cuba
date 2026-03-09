"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateFoodProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  
  // Manejo de Imágenes
  const file = formData.get("file") as File;
  const manualUrl = formData.get("imageUrl") as string;
  let finalImageUrl: string | null = null;

  try {
    if (file && file.size > 0) {
      // ☁️ Subida de nueva foto a Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "luque-habana-menu" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      finalImageUrl = (uploadResult as any).secure_url;
    } else if (manualUrl && manualUrl.startsWith("http")) {
      finalImageUrl = manualUrl;
    }

    // Actualización en Prisma
    await prisma.product.update({
      where: { id },
      data: {
        title: name,
        price: price,
        category: category,
        description: description,
        // Solo actualizamos la imagen si se envió una nueva
        ...(finalImageUrl && {
          images: {
            deleteMany: {}, // Borramos las anteriores (simplificado)
            create: { url: finalImageUrl }
          }
        })
      },
    });

    revalidatePath("/mis-publicaciones");
    revalidatePath(`/editar/${id}`);
  } catch (error) {
    console.error("Error actualizando plato:", error);
    throw new Error("Error al guardar los cambios");
  }

  redirect("/mis-publicaciones");
}