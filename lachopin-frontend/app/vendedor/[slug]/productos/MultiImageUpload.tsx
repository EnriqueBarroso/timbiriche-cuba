"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Loader2, ImagePlus } from "lucide-react";

const TERRACOTTA = "#B84C24";
export const MAX_PRODUCT_IMAGES = 5;

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

// Mismo mecanismo de subida directa a Cloudinary (unsigned) que ImageUpload.tsx,
// pero soportando varios archivos y un límite de MAX_PRODUCT_IMAGES —
// mismo límite que EditForm.tsx en /mis-publicaciones.
export default function MultiImageUpload({ images, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.error("Falta la variable NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "timbiriche_uploads",
    );

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url ?? null;
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = MAX_PRODUCT_IMAGES - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of filesToUpload) {
        const url = await uploadFile(file);
        if (url) uploaded.push(url);
      }
      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
      }
      if (uploaded.length < filesToUpload.length) {
        alert("Alguna imagen no se pudo subir. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      alert("Error de conexión al subir las imágenes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((url, index) => (
          <div
            key={url + index}
            className="relative aspect-square rounded-2xl overflow-hidden border border-black/10 bg-gray-100"
          >
            <Image src={url} alt={`Foto ${index + 1}`} fill className="object-cover" sizes="120px" />
            {index === 0 && (
              <span
                className="absolute bottom-1 left-1 text-[9px] font-black text-white px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: TERRACOTTA }}
              >
                Portada
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
              aria-label={`Eliminar foto ${index + 1}`}
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {images.length < MAX_PRODUCT_IMAGES && (
          <label
            className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-black/10 bg-white text-gray-400 transition-colors cursor-pointer hover:border-[#B84C24] hover:text-[#B84C24] ${
              isUploading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {isUploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-[10px] font-bold">Añadir foto</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Hasta {MAX_PRODUCT_IMAGES} fotos. La primera será la portada.
      </p>
    </div>
  );
}
