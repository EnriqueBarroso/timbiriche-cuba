"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Asumo que usas sonner o similar, si no, usa alert

export default function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Datos a compartir
    const shareData = {
      title: title,
      text: text,
      url: window.location.href,
    };

    // 1. Si el navegador soporta compartir nativo (Móviles)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error compartiendo:", err);
      }
    } else {
      // 2. Si es PC, copiamos al portapapeles
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Enlace copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("No se pudo copiar", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-600 transition-all active:scale-95 border border-gray-200"
      title="Compartir"
    >
      {copied ? <Check className="w-6 h-6 text-green-600" /> : <Share2 className="w-6 h-6" />}
    </button>
  );
}