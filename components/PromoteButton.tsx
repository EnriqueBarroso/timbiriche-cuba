// components/PromoteButton.tsx
"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { togglePromotedStatus } from "@/lib/actions";

export default function PromoteButton({
  productId,
  isPromoted,
}: {
  productId: string;
  isPromoted: boolean;
}) {
  const [promoted, setPromoted] = useState(isPromoted);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const result = await togglePromotedStatus(productId);
      if (result.success) {
        setPromoted(result.isPromoted);
      }
    } catch (error) {
      console.error("Error al cambiar promoción:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
        promoted
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={promoted ? "Quitar de Ofertas Flash" : "Agregar a Ofertas Flash"}
    >
      <Zap className={`w-3.5 h-3.5 ${promoted ? "fill-red-600" : ""}`} />
      {loading ? "..." : promoted ? "Flash ✓" : "Flash"}
    </button>
  );
}