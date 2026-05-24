"use server";

import { getSellerByEmail, createProduct } from "@/lib/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createFoodProduct(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");

  const email = user.emailAddresses[0].emailAddress;
  const seller = await getSellerByEmail(email);
  if (!seller) throw new Error("Vendedor no encontrado");

  let finalImageUrl = "/placeholder.png";
  const file = formData.get("file") as File;
  const manualUrl = formData.get("imageUrl") as string;

  try {
    if (file && file.size > 0) {
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

    const { getToken } = await auth();
    const token = await getToken();
    await createProduct({
      title: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      sellerId: seller.id,
      type: "EATS",
      images: [finalImageUrl],
    }, token ?? undefined);

    revalidatePath("/mis-publicaciones");
  } catch (error) {
    console.error("Error al crear el plato:", error);
    throw new Error("No se pudo crear el plato. Revisa la consola.");
  }

  redirect("/mis-publicaciones");
}
