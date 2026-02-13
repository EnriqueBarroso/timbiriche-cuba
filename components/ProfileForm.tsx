"use client"

import { useState } from "react";
import { Save, User, Phone, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { updateProfile } from "@/lib/actions";

interface Props {
  initialData: {
    storeName: string | null;
    phoneNumber: string | null;
    avatar?: string | null;
  }
}

// Estilos de alta legibilidad (Texto Negro sobre Blanco)
const inputStyles = "w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm";

export default function ProfileForm({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  
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
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "timbiriche_uploads");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const fileData = await res.json();
      setFormData(prev => ({ ...prev, avatar: fileData.secure_url }));
      toast.success("Imagen de perfil lista");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error al subir imagen");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación mínima para WhatsApp
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      return toast.error("El teléfono debe tener al menos 8 dígitos");
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        storeName: formData.storeName,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar,
      });
      toast.success("¡Perfil actualizado!");      
      router.refresh(); 
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push("/vender"); 
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("No se pudieron guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 max-w-lg mx-auto">
      <div className="space-y-6">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white bg-gray-50 relative shadow-md">
              {formData.avatar ? (
                <Image 
                  src={formData.avatar} 
                  alt="Avatar" 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <User className="h-14 w-14 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg active:scale-90">
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                disabled={isUploadingAvatar} 
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 font-medium">Foto de tu negocio o perfil</p>
        </div>

        {/* Nombre de la Tienda */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Nombre de tu Tienda / Usuario
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
            placeholder="Ej: Mi Tienda en LaChopin"
            className={inputStyles}
            required
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600" />
            WhatsApp (Solo números)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-700 font-bold text-sm">
              +53
            </span>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="5xxxxxxx"
              className={`${inputStyles} rounded-l-none`}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Los compradores te contactarán por WhatsApp
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploadingAvatar}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg active:scale-[0.98]"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}