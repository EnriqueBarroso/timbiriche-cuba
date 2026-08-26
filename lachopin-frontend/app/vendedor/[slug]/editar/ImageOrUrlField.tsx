"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";

interface Props {
  fieldName: string;
  label: string;
  initialValue: string;
  placeholder?: string;
}

// El formulario padre es un <form action={serverAction}> nativo (FormData),
// así que este campo siempre expone su valor actual vía un input oculto con
// el mismo `name` — funciona igual sin importar si el usuario subió un
// archivo o pegó una URL a mano.
export default function ImageOrUrlField({ fieldName, label, initialValue, placeholder }: Props) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [value, setValue] = useState(initialValue || "");

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 ml-1">
        <label className="block text-[10px] font-bold text-gray-400 uppercase">{label}</label>
        <div className="flex gap-0.5 bg-gray-100 rounded-full p-0.5">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
              mode === "upload" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"
            }`}
          >
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
              mode === "url" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"
            }`}
          >
            Pegar URL
          </button>
        </div>
      </div>

      <input type="hidden" name={fieldName} value={value} />

      {mode === "upload" ? (
        <ImageUpload value={value} onUpload={setValue} onRemove={() => setValue("")} />
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || "https://..."}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
        />
      )}
    </div>
  );
}
