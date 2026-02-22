"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ImageIcon, Loader2, X } from "lucide-react";
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

  // Extraemos las URLs de las imágenes que ya tenía el producto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialImages = product.images ? product.images.map((img: any) => img.url) : [];

  const [formData, setFormData] = useState({
    title: product.title || "",
    price: product.price ? product.price.toString() : "0", 
    currency: product.currency || "USD",
    description: product.description || "",
    category: product.category || "others",
    images: initialImages, // Ahora guardamos un array de imágenes
  });

  // Función para eliminar una imagen de la lista
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_: string, index: number) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica: Al menos una imagen
    if (formData.images.length === 0) {
      toast.error("Debes subir al menos una imagen del producto");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: formData.title,
        price: Math.round(parseFloat(formData.price)),
        currency: formData.currency,
        description: formData.description,
        category: formData.category,
        images: formData.images // Le pasamos el array completo de imágenes finales
      };

      await updateProduct(product.id, payload);

      toast.success("Producto actualizado");
      router.push("/mis-publicaciones");
      router.refresh(); 

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* GALERÍA DE IMÁGENES (Soporta múltiples) */}
        <div>
          <label className="block text-sm font-bold mb-3">Imágenes del Producto</label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-3">
            {/* Mostrar imágenes actuales */}
            {formData.images.map((url: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                
                {/* Botón flotante para eliminar esta imagen */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                  title="Eliminar imagen"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ))}

            {/* Botón para subir más fotos (Límite visual de 5 fotos, opcional) */}
            {formData.images.length < 5 && (
              <CldUploadWidget 
                uploadPreset="timbiriche_preset"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSuccess={(result: any) => {
                  setFormData({ ...formData, images: [...formData.images, result.info.secure_url] });
                }}
              >
                {({ open }) => (
                  <button 
                    type="button" 
                    onClick={() => open()} 
                    className="aspect-square flex flex-col items-center justify-center gap-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-100 hover:border-blue-400 transition-all text-gray-500 hover:text-blue-600"
                  >
                    <ImageIcon size={24} />
                    <span className="text-[10px] font-bold">Añadir Foto</span>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>
          <p className="text-xs text-gray-400">Puedes subir hasta 5 imágenes. La primera será la portada.</p>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-bold mb-1">Título</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className={inputStyles} />
        </div>

        {/* Precio y Moneda */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Precio</label>
            <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className={inputStyles} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Moneda</label>
            <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className={inputStyles}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CUP">CUP</option>
              <option value="MLC">MLC</option>
            </select>
          </div>
        </div>

        {/* Categoría (LISTA ACTUALIZADA) */}
        <div>
          <label className="block text-sm font-bold mb-1">Categoría</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputStyles}>
             <option value="cellphones">📱 Celulares y Tablets</option>
             <option value="vehicles">🚗 Motos, Carros y Bicicletas</option>
             <option value="fashion">👗 Ropa y Calzado</option>
             <option value="appliances">📺 Electrodomésticos</option>
             <option value="home">🛋️ Hogar y Muebles</option>
             <option value="food">🍗 Combos y Alimentos</option>
             <option value="parts">🔧 Piezas y Accesorios</option>
             <option value="crafts">🎨 Artesanía y Manufactura</option>
             <option value="others">📦 Otros</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold mb-1">Descripción</label>
          <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className={inputStyles} />
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => router.back()} className="flex-1 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          
          <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-white bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}