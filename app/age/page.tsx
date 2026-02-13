"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

function AgeVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (!isChecked) {
      alert("Debes confirmar que eres mayor de 18 años");
      return;
    }

    // Establece la cookie de confirmación
    document.cookie = "age_ok=1; path=/; max-age=31536000"; // 1 año

    // Redirige a donde venía o a home
    const returnTo = searchParams.get("returnTo") || "/";
    router.push(returnTo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        
        {/* Icono */}
        <div className="mb-6 flex justify-center">
          <div className="bg-orange-100 p-4 rounded-full">
            <ShieldCheck className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Verificación de Edad
        </h1>
        
        {/* Descripción */}
        <p className="text-gray-600 mb-8">
          Para acceder a <span className="font-semibold text-orange-600">LaChopin</span>, 
          debes confirmar que eres mayor de 18 años.
        </p>

        {/* Checkbox */}
        <label className="flex items-start gap-3 mb-8 cursor-pointer group">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
          />
          <span className="text-left text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            Confirmo que tengo <strong>18 años o más</strong> y acepto los términos de uso de la plataforma.
          </span>
        </label>

        {/* Botón */}
        <button
          onClick={handleConfirm}
          disabled={!isChecked}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            isChecked
              ? "bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/30"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar y Continuar
        </button>

        {/* Nota legal */}
        <p className="mt-6 text-xs text-gray-400">
          Al continuar, confirmas que cumples con los requisitos de edad establecidos por la ley.
        </p>
      </div>
    </div>
  );
}

export default function AgePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    }>
      <AgeVerificationContent />
    </Suspense>
  );
}
