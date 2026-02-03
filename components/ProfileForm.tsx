"use client"

import { useState } from "react";
import { Save, User, Phone, Loader2, Camera } from "lucide-react"; // Camera ya estaba importada
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
// 👇 1. IMPORTAMOS LA ACCIÓN
import { updateProfile } from "@/lib/actions";

interface Props {
  initialData: {
    storeName: string | null;
    phoneNumber: string | null;
    avatar?: string | null;
  }
}

export default function ProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: initialData.storeName || "",
    phoneNumber: initialData.phoneNumber || "",
    avatar: initialData.avatar || "",
  });

  // ... (Tu función handleAvatarUpload se queda EXACTAMENTE IGUAL) ...
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      // (Mantén tu código de Cloudinary aquí tal cual lo tienes)
      // Solo asegúrate de que al final haga: setFormData({ ...formData, avatar: url })
      // Voy a asumir que tu código original funcionaba bien para la subida.
      
      // Resumen de tu lógica original para contexto:
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploadingAvatar(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "timbiriche_uploads");

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });
        const file = await res.json();
        setFormData(prev => ({ ...prev, avatar: file.secure_url }));
        toast.success("Imagen subida");
      } catch (error) {
        toast.error("Error al subir imagen");
      } finally {
        setIsUploadingAvatar(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 👇 2. USAMOS LA SERVER ACTION (Reemplaza al fetch /api/profile)
      await updateProfile({
        storeName: formData.storeName,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar,
      });

      toast.success("Perfil actualizado correctamente");
      router.refresh(); 

    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
      <div className="space-y-6">
        
        {/* Avatar - Mantenemos tu UI */}
        <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative group">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 relative">
                    {formData.avatar ? (
                        <Image src={formData.avatar} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <User className="h-12 w-12 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                    {/* Overlay de carga */}
                    {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                </label>
            </div>
        </div>

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
        </div>

        {/* Teléfono */}
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
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="5xxxxxxx"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploadingAvatar}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Mi Perfil
        </button>

      </div>
    </form>
  );
}