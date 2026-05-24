"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions";
import { toast } from "sonner";

interface Props {
  productId: string;
}

export default function DeleteProductButton({ productId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Confirmación nativa (simple y efectiva para empezar)
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.");
    
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const result = await deleteProduct(productId);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Publicación eliminada correctamente");
      }
    } catch (error) {
      toast.error("Ocurrió un error al intentar eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm border border-red-100 hover:bg-red-50 hover:scale-110 transition-all disabled:opacity-50"
      title="Eliminar publicación"
    >
      {isDeleting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
    </button>
  );
}