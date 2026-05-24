"use server";

import { updateProduct } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleProductAvailability(id: string, wantToBeAvailable: boolean) {
  try {
    const newSoldStatus = !wantToBeAvailable;
    const { getToken } = await auth();
    const token = await getToken();
    await updateProduct(String(id), { isSold: newSoldStatus }, token ?? undefined);
    revalidatePath("/mis-publicaciones");
    return { success: true };
  } catch (error) {
    console.error("ERROR CRÍTICO EN ACCIÓN:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
