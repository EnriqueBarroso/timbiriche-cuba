"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ IMPORTANTE: El nombre DEBE ser createFoodProduct
export async function createFoodProduct(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;
  const seller = await prisma.seller.findUnique({ where: { email } });
  if (!seller) throw new Error("Vendedor no encontrado");

  // Manejo de Imagen
  let finalImageUrl = "/placeholder.png";
  const file = formData.get("file") as File;
  const manualUrl = formData.get("imageUrl") as string;

  try {
    if (file && file.size > 0) {
      // Subida a Cloudinary
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

    // 🚀 LÓGICA DE CREACIÓN (No de actualización)
    await prisma.product.create({
      data: {
        title: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string) || 0,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        sellerId: seller.id,
        isSold: false,
        images: {
          create: {
            url: finalImageUrl
          }
        }
      },
    });

    revalidatePath("/mis-publicaciones");

  } catch (error) {
    console.error("Error al crear el plato:", error);
    throw new Error("No se pudo crear el plato. Revisa la consola.");
  }

  // Siempre fuera del try/catch
  redirect("/mis-publicaciones");
}