"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import { createProduct } from "@/lib/actions";
import { Loader2, DollarSign, Utensils, AlignLeft, ChefHat } from "lucide-react";
import { toast } from "sonner";

export default function NuevoPlatoForm() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    images: [] as string[],
  });

  if (isLoaded && !isSignedIn) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      return toast.error("¡Sube al menos 1 foto apetitosa de tu plato!");
    }

    try {
      setIsLoading(true);

      // Validación de perfil (igual que en tu form normal)
      const profileRes = await fetch('/perfil/check', { cache: 'no-store' });
      if (!profileRes.ok) throw new Error("Error perfil");
      const profile = await profileRes.json();
      const cleanPhone = profile.phoneNumber?.replace(/\D/g, '') || '';

      if (cleanPhone.length < 8) {
        toast.error("Número de WhatsApp requerido para recibir pedidos");
        router.push("/perfil?returnTo=/vender");
        return;
      }

      // Creamos el plato usando tu Server Action existente
      await createProduct({
        title: formData.title,
        price: Number(formData.price),
        currency: "USD", // Forzamos moneda principal por defecto para comida
        category: "food", // Guardamos silenciosamente en la categoría comida
        description: formData.description,
        images: formData.images,
        isFlashOffer: false, 
      });

      toast.success("¡Plato añadido al menú!");
      router.push("/eats"); // Lo mandamos al hub de Eats

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al publicar el plato");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] outline-none transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4 pb-32">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-fit">
        
        {/* Cabecera del Formulario */}
        <div className="bg-[#D32F2F] p-6 text-white text-center relative">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <ChefHat size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Añadir Plato</h1>
          <p className="text-red-100 text-sm mt-1">Sube un nuevo plato a tu menú digital</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Foto del Plato usando tu componente */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Foto del plato *</label>
              <MultiImageUpload
                values={formData.images}
                onUpload={(urls) => setFormData({ ...formData, images: urls })}
                maxImages={1} // Recomendamos 1 foto principal para restaurantes
              />
            </div>

            {/* Nombre del Plato */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del plato</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Utensils size={18} className="text-gray-400" />
                </div>
                <input 
                  required
                  type="text" 
                  placeholder="Ej: Pizza Pepperoni Familiar" 
                  className={`${inputStyles} pl-11`}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Ingredientes / Descripción */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ingredientes (Descripción)</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <AlignLeft size={18} className="text-gray-400" />
                </div>
                <textarea 
                  required
                  rows={3}
                  placeholder="Salsa de tomate artesanal, doble mozzarella, pepperoni..." 
                  className={`${inputStyles} pl-11 resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Precio ($)</label>
              <div className="relative w-1/2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="0.00" 
                  className={`${inputStyles} pl-11 font-bold text-lg`}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* Botón Guardar */}
            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#D32F2F] text-white font-bold text-lg py-4 rounded-xl hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-red-200 mt-4 flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Utensils size={24} />}
              {isLoading ? "Publicando plato..." : "Publicar en el Menú"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}