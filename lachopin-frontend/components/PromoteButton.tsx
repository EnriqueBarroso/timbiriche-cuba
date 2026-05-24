// components/PromoteButton.tsx
"use client";

import { useState } from "react";
import { Crown } from "lucide-react"; // 👇 Cambiamos Zap por Crown
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
          ? "bg-amber-100 text-amber-800 hover:bg-amber-200" // 👇 Colores Premium
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={promoted ? "Quitar Premium" : "Hacer Premium"}
    >
      <Crown className={`w-3.5 h-3.5 ${promoted ? "fill-amber-600 text-amber-600" : ""}`} />
      {loading ? "..." : promoted ? "Premium ✓" : "Premium"}
    </button>
  );
}