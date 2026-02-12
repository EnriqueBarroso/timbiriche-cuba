"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CldUploadWidget } from 'next-cloudinary';
import { updateProduct } from "@/lib/actions";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export default function EditForm({ product }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyles = "w-full p-3 border rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  const [formData, setFormData] = useState({
    title: product.title || "",
    // ✅ CORREGIDO: Sin dividir por 100
    price: product.price ? product.price.toString() : "0", 
    currency: product.currency || "USD",
    description: product.description || "",
    category: product.category || "others",
    imageUrl: product.images?.[0]?.url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    // 🛑 1. ESTO ES LO MÁS IMPORTANTE: Detiene el envío HTML y evita el error 404
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // 2. Preparamos los datos para la DB
      // ✅ CORREGIDO: Sin multiplicar por 100
      const payload = {
        ...formData,
        price: Math.round(parseFloat(formData.price)),
        images: formData.imageUrl ? [formData.imageUrl] : [] // Formato array para la acción
      };

      // 3. Llamamos a la Server Action
      await updateProduct(product.id, payload);

      toast.success("Producto actualizado");
      router.push("/mis-publicaciones");
      router.refresh(); // Actualiza la vista de fondo

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      
      {/* 👇 IMPORTANTE: El onSubmit va AQUÍ, en la etiqueta form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Foto */}
        <div>
          <label className="block text-sm font-bold mb-2">Imagen Principal</label>
          <div className="flex items-center gap-4">
            {formData.imageUrl ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                Sin foto
              </div>
            )}
            
            <CldUploadWidget 
              uploadPreset="timbiriche_preset"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSuccess={(result: any) => setFormData({ ...formData, imageUrl: result.info.secure_url })}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="bg-gray-100 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors text-gray-700">
                  <ImageIcon className="w-4 h-4" /> Cambiar Foto
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-bold mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className={inputStyles}
          />
        </div>

        {/* Precio y Moneda */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Moneda</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className={inputStyles}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CUP">CUP</option>
              <option value="MLC">MLC</option>
            </select>
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-bold mb-1">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputStyles}
          >
             <option value="food">🍗 Combos y Alimentos</option>
             <option value="parts">🔧 Piezas y Accesorios</option>
             <option value="crafts">🎨 Artesanía y Manufactura</option>
             <option value="tech">📱 Tecnología</option>
             <option value="fashion">👗 Ropa y Moda</option>
             <option value="others">📦 Otros</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold mb-1">Descripción</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className={inputStyles}
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 text-white bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}