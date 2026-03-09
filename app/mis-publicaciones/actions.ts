"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductAvailability(id: string, wantToBeAvailable: boolean) {
  try {
    // LOG DE DEPURACIÓN (Míralo en tu terminal de VS Code)
    console.log(`Intentando cambiar producto ${id} a Disponible: ${wantToBeAvailable}`);

    // Si wantToBeAvailable es true -> isSold debe ser false (plato activo)
    // Si wantToBeAvailable es false -> isSold debe ser true (plato agotado)
    const newSoldStatus = !wantToBeAvailable;

    await prisma.product.update({
      where: { id: String(id) },
      data: {
        isSold: newSoldStatus,
      },
    });

    revalidatePath("/mis-publicaciones");
    return { success: true };
  } catch (error) {
    console.error("ERROR CRÍTICO EN ACCIÓN:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}