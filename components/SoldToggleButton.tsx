"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { toggleProductStatus } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  isSold: boolean;
}

export default function SoldToggleButton({ productId, isSold }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    try {
      setLoading(true);
      const result = await toggleProductStatus(productId);
      
      if (result.isSold) {
        toast.success("¡Marcado como VENDIDO!");
      } else {
        toast.info("Producto disponible de nuevo");
      }
      
      router.refresh(); // Refrescar la página para ver el cambio visual
    } catch (error) {
      console.error(error)
      toast.error("Error al cambiar estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full shadow-sm backdrop-blur-sm transition-all ${
        isSold 
          ? "bg-green-100 text-green-700 hover:bg-green-200" // Estilo si ya está vendido
          : "bg-white/90 text-gray-500 hover:text-green-600 hover:bg-white" // Estilo normal
      }`}
      title={isSold ? "Marcar como Disponible" : "Marcar como Vendido"}
    >
      <Tag className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} />
    </button>
  );
}