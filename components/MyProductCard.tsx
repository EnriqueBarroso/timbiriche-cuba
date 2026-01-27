"use client"

import { Product } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
}

export default function MyProductCard({ product }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este producto?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al borrar");

      toast.success("Producto eliminado");
      router.refresh(); // Recarga la página para que desaparezca
    } catch (error) {
      toast.error("No se pudo eliminar");
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      
      {/* Imagen + Estado */}
      <div className="h-48 bg-gray-100 relative group">
        {product.images[0] ? (
          <img src={product.images[0].url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin Foto</div>
        )}
        
        {/* Overlay para ver producto */}
        <Link href={`/product/${product.id}`} className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
           <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
             <Eye className="w-3 h-3" /> Ver anuncio
           </span>
        </Link>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 line-clamp-1">{product.title}</h3>
        <p className="text-blue-600 font-bold mb-4">${(product.price / 100).toFixed(2)}</p>

        <div className="mt-auto flex gap-2">
          {/* Botón Editar */}
          {/* Nota: Necesitaremos crear la página /editar/[id] más adelante */}
          <Link 
            href={`/editar/${product.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-4 h-4" /> Editar
          </Link>

          {/* Botón Borrar */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "..." : <><Trash2 className="w-4 h-4" /> Borrar</>}
          </button>
        </div>
      </div>
    </div>
  );
}