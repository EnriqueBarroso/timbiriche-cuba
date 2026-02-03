"use client"

import { useState } from "react";
import { Save, User, Phone, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "timbiriche_uploads");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName) {
        throw new Error("Falta configuración de Cloudinary");
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, avatar: data.secure_url }));
        toast.success("Foto actualizada");
      } else {
        throw new Error("No se pudo subir la imagen");
      }
    } catch (error) {
      console.error("Error subiendo avatar:", error);
      toast.error("Error al subir la foto");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de teléfono
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      toast.error("El teléfono debe tener al menos 8 dígitos");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar");
      }

      toast.success("¡Perfil actualizado correctamente!");
      router.refresh();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular progreso del perfil
  const progress = [
    formData.storeName,
    formData.phoneNumber,
    formData.avatar
  ].filter(Boolean).length;
  const progressPercent = Math.round((progress / 3) * 100);

  return (
    <div className="space-y-6">
      
      {/* Indicador de progreso */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-900">Perfil completo al {progressPercent}%</span>
          <span className="text-xs text-blue-600">{progress}/3 completados</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Foto de Perfil
            </label>
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-gray-100">
                {formData.avatar ? (
                  <Image
                    src={formData.avatar}
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110">
                {isUploadingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Sube una foto de perfil para tu tienda
            </p>
          </div>

          {/* Nombre de la Tienda */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Nombre de tu Tienda / Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              placeholder="Ej: ElectroMuebles Habana"
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Así aparecerás en tus productos.</p>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              Número de WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 md:px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-700 text-sm md:text-base font-bold">
                +53
              </span>
              <input
                type="tel"
                value={formData.phoneNumber || ""}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="5xxxxxxx (ej: 53012345)"
                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm md:text-base"
                required
                minLength={8}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Imprescindible para que los clientes te contacten. Mínimo 8 dígitos.
            </p>
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 md:py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Mi Perfil
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  );
}