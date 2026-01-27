"use client"

import { useState } from "react";
import { Save, User, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  initialData: {
    storeName: string | null;
    phoneNumber: string | null;
  }
}

export default function ProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: initialData.storeName || "",
    phoneNumber: initialData.phoneNumber || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success("Perfil actualizado correctamente");
      router.refresh(); // Refrescamos para que los cambios se apliquen

    } catch (error) {
      toast.error("No se pudieron guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
      <div className="space-y-6">
        
        {/* Nombre de la Tienda */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Nombre de tu Tienda / Usuario
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
            placeholder="Ej: ElectroMuebles Habana"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Así aparecerás en tus productos.</p>
        </div>

        {/* Teléfono / WhatsApp */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600" />
            Número de WhatsApp
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-bold">
              +53
            </span>
            <input
              type="tel"
              // Importante: Si formData.phoneNumber es null, usa "" para evitar error de React
              value={formData.phoneNumber || ""} 
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
              placeholder="5xxxxxxx"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Imprescindible para que los clientes te contacten.</p>
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Mi Perfil
        </button>

      </div>
    </form>
  );
}