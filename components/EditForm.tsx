"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CldUploadWidget } from 'next-cloudinary';
// 👇 Importamos la acción del servidor
import { updateProduct } from "@/lib/actions"; 

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any; // Usamos any para flexibilidad
}

export default function EditForm({ product }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: product.title || "",
    // Si tu precio viene en centavos (ej: 5000), lo convertimos a string (50.00) para el input
    price: product.price ? (product.price / 100).toString() : "0",
    description: product.description || "",
    category: product.category || "otros",
    imageUrl: product.images?.[0]?.url || "",
    isActive: product.isActive ?? true // Default true si no existe
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Truco para leer checkbox en TypeScript
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 👇 LLAMADA AL SERVER ACTION EN LUGAR DE FETCH
      await updateProduct(product.id, {
        title: formData.title,
        price: parseFloat(formData.price) * 100, // Convertimos de vuelta a centavos
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        isActive: Boolean(formData.isActive)
      });

      toast.success("Producto actualizado correctamente");
      router.push("/mis-publicaciones");
      router.refresh(); 

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar cambios");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      
      {/* Switch Activo/Pausado */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="font-medium text-gray-700">Producto Visible</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            name="isActive"
            checked={Boolean(formData.isActive)}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-bold mb-1">Título</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Precio y Categoría */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Categoría</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
              <option value="tecnologia">Tecnología</option>
              <option value="moda">Moda</option>
              <option value="hogar">Hogar</option>
              <option value="vehiculos">Vehículos</option>
              <option value="deportes">Deportes</option>
              <option value="entretenimiento">Ocio</option>
          </select>
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-bold mb-2">Imagen Principal</label>
        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden group border border-gray-200 flex items-center justify-center">
           {formData.imageUrl ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
           ) : (
             <span className="text-gray-400">Sin imagen</span>
           )}
           
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <CldUploadWidget 
                uploadPreset="timbiriche_preset" // ⚠️ Asegúrate que este preset existe en tu Cloudinary
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSuccess={(result: any) => setFormData({ ...formData, imageUrl: result.info.secure_url })}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="bg-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-100 cursor-pointer z-10">
                    <ImageIcon className="w-4 h-4" /> Cambiar Foto
                  </button>
                )}
              </CldUploadWidget>
           </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-bold mb-1">Descripción</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 text-white bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
