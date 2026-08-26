"use client";

import { useState } from "react";
import { Power, PowerOff } from "lucide-react";
import { toggleProductAvailability } from "@/app/mis-publicaciones/actions";

interface Props {
  productId: string;
  initialIsSold: boolean;
}

// Mismo endpoint/lógica que ya usa /mis-publicaciones (InventoryManager.tsx):
// toggleProductAvailability invierte "isSold" en el backend. Aquí solo
// añadimos el mismo patrón de actualización optimista.
export default function AvailabilityToggle({ productId, initialIsSold }: Props) {
  const [isAvailable, setIsAvailable] = useState(!initialIsSold);

  const handleToggle = async () => {
    const next = !isAvailable;

    // 1. Cambio visual instantáneo (optimista)
    setIsAvailable(next);

    // 2. Llamada al servidor
    const result = await toggleProductAvailability(productId, next);

    // 3. Si falla, revertimos el cambio visual
    if (result?.error) {
      setIsAvailable(!next);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${
        isAvailable
          ? "text-green-600 bg-green-50 border-green-100"
          : "text-red-600 bg-red-50 border-red-100"
      }`}
      aria-label={isAvailable ? "Marcar como vendido" : "Marcar como disponible"}
      title={isAvailable ? "Disponible — clic para marcar vendido" : "Vendido — clic para marcar disponible"}
    >
      {isAvailable ? <Power size={15} /> : <PowerOff size={15} />}
    </button>
  );
}
