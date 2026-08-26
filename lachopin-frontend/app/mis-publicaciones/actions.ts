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
    // También usado desde /vendedor/[slug]/productos (AvailabilityToggle) —
    // sin esto esa página quedaba con datos viejos en caché tras la mutación.
    revalidatePath("/vendedor/[slug]/productos", "page");
    return { success: true };
  } catch (error) {
    console.error("ERROR CRÍTICO EN ACCIÓN:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
