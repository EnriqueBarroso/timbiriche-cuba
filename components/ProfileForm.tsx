"use client"

import { useState } from "react";
import { Save, User, Phone, Loader2, Camera, Wallet } from "lucide-react"; // Importamos Wallet para el icono
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { updateProfile } from "@/lib/actions";

interface Props {
  initialData: {
    storeName: string | null;
    phoneNumber: string | null;
    avatar?: string | null;
    acceptsZelle?: boolean; // Nuevos campos
    zelleEmail?: string | null;
  }
}

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
    acceptsZelle: initialData.acceptsZelle || false, // Estado de Zelle
    zelleEmail: initialData.zelleEmail || "",
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
    
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      return toast.error("El teléfono debe tener al menos 8 dígitos");
    }

    // Validación de Zelle: Si dice que acepta, debe poner el correo
    if (formData.acceptsZelle && !formData.zelleEmail.trim()) {
      return toast.error("Debes ingresar tu correo o teléfono de Zelle");
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        storeName: formData.storeName,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar,
        acceptsZelle: formData.acceptsZelle, // Enviamos a la BD
        zelleEmail: formData.zelleEmail,
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
          {/* ... (Tu código de avatar intacto) ... */}
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

        {/* Nombre y Teléfono */}
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
        </div>

        {/* 👇 NUEVA SECCIÓN: MÉTODOS DE PAGO (ZELLE) 👇 */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-purple-600" />
            Métodos de Pago
          </h3>
          
          <div className={`p-4 rounded-2xl border-2 transition-all ${formData.acceptsZelle ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-gray-900 text-base">Acepto Zelle</span>
                <p className="text-xs text-gray-500 font-medium">Recibe pagos desde USA</p>
              </div>
              
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.acceptsZelle}
                  onChange={(e) => setFormData({ ...formData, acceptsZelle: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Campo que aparece solo si activa Zelle */}
            {formData.acceptsZelle && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-purple-800 mb-1">
                  Correo o Teléfono de tu cuenta Zelle
                </label>
                <input
                  type="text"
                  value={formData.zelleEmail}
                  onChange={(e) => setFormData({ ...formData, zelleEmail: e.target.value })}
                  placeholder="ejemplo@correo.com o +1234567890"
                  className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                  required={formData.acceptsZelle}
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploadingAvatar}
          className="w-full py-4 mt-2 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg active:scale-[0.98]"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}