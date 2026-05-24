"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  value: string;
}

export function ImageUpload({ onUpload, onRemove, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    // Usamos el preset definido en tu .env o el valor por defecto
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "timbiriche_uploads"); 

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName) {
        throw new Error("Falta la variable NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        console.error("Error subiendo imagen:", data);
        alert("Error al subir la imagen. Revisa la consola.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  // 1. ESTADO: YA HAY IMAGEN (Muestra la previsualización)
  if (value) {
    return (
      <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl border border-gray-200 shadow-sm group">
        <Image 
          fill 
          src={value} 
          alt="Producto" 
          className="object-cover" 
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="rounded-full bg-red-500 p-3 text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
        </div>
      </div>
    );
  }

  // 2. ESTADO: SUBIENDO O ESPERANDO (Drag & Drop visual)
  return (
    <div className="w-full max-w-[300px]">
      <label className="flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all cursor-pointer relative group">
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-600">Subiendo a la nube...</p>
            </>
          ) : (
            <>
              <div className="mb-4 p-4 rounded-full bg-white shadow-sm ring-1 ring-gray-200 group-hover:scale-110 transition-transform duration-300">
                <ImagePlus className="h-8 w-8 text-blue-600" />
              </div>
              <p className="mb-2 text-sm text-gray-900 font-semibold">
                Sube tu foto
              </p>
              <p className="text-xs text-gray-500">
                JPG o PNG (Máx 10MB)
              </p>
            </>
          )}
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleUpload} 
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
