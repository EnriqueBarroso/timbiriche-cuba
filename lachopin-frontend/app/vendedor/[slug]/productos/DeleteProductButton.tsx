"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions";
import { toast } from "sonner";

interface Props {
  productId: string;
  productTitle: string;
}

export default function DeleteProductButton({ productId, productTitle }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Eliminar "${productTitle}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const result = await deleteProduct(productId);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Producto eliminado");
        router.refresh();
      }
    } catch {
      toast.error("Ocurrió un error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="self-center shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-black/10 text-gray-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors disabled:opacity-50"
      aria-label={`Eliminar ${productTitle}`}
    >
      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
