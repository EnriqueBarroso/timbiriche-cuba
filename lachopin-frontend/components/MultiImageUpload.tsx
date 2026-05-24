"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Loader2, ImagePlus, Star } from "lucide-react";

interface MultiImageUploadProps {
  onUpload: (urls: string[]) => void;
  values: string[];
  maxImages?: number;
}

export function MultiImageUpload({ onUpload, values, maxImages = 5 }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar límite
    if (values.length >= maxImages) {
      alert(`Máximo ${maxImages} fotos permitidas`);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
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
        onUpload([...values, data.secure_url]);
      } else {
        console.error("Error subiendo imagen:", data);
        alert("Error al subir la imagen. Revisa la consola.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión al subir la imagen.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onUpload(newValues);
  };

  return (
    <div className="w-full">
      
      {/* Grid de imágenes */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        
        {/* Imágenes subidas */}
        {values.map((url, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100 group">
            <Image 
              fill 
              src={url} 
              alt={`Foto ${index + 1}`} 
              className="object-cover" 
              sizes="(max-width: 768px) 33vw, 150px"
            />
            
            {/* Badge "Principal" en la primera imagen */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-white" />
                Principal
              </div>
            )}
            
            {/* Botón eliminar */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(index);
                }}
                className="rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                type="button"
                aria-label={`Eliminar foto ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Botón de subida - Solo si no alcanzamos el límite */}
        {values.length < maxImages && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center group">
            
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-xs text-gray-500 mt-2">Subiendo...</p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white shadow-sm ring-1 ring-gray-200 group-hover:scale-110 transition-transform mb-2">
                  <ImagePlus className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-700 font-medium">Añadir foto</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {values.length}/{maxImages}
                </p>
              </>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleUpload} 
              disabled={isUploading}
            />
          </label>
        )}

        {/* Placeholders vacíos para mostrar cuántas fotos faltan */}
        {Array.from({ length: maxImages - values.length - 1 }).map((_, i) => (
          <div 
            key={`placeholder-${i}`} 
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center"
          >
            <span className="text-gray-300 text-2xl">+</span>
          </div>
        ))}
      </div>

      {/* Helper text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="flex items-center gap-1">
          <Star className="w-3 h-3 text-blue-600" />
          La primera foto será la imagen principal
        </p>
        <p>• Sube hasta {maxImages} fotos (JPG o PNG, máx 10MB cada una)</p>
        <p>• Puedes eliminar fotos haciendo hover y clic en la X</p>
      </div>
    </div>
  );
}