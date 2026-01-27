"use client"

import { Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
  productId: string;
}

export default function ProductCardActions({ productId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // Confirmación simple del navegador
    const confirm = window.confirm("¿Seguro que quieres borrar este producto? No se puede deshacer.");
    if (!confirm) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo borrar");

      toast.success("Producto eliminado");
      
      // Recargamos la página para que desaparezca el producto de la lista
      router.refresh(); 

    } catch (error) {
      toast.error("Error al borrar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-3 bg-gray-50">
      {/* Botón Editar (Todavía no funciona, lo haremos luego) */}
      <Link href={`/editar/${productId}`}>
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <Edit className="w-4 h-4" /> Editar
        </button>
      </Link>
      
      {/* Botón Borrar */}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <>
                <Trash2 className="w-4 h-4" /> Borrar
            </>
        )}
      </button>
    </div>
  );
}