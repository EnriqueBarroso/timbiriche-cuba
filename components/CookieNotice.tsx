"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar solo si no ha aceptado antes
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Pequeño delay para no molestar inmediatamente
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 bg-yellow-100 p-2 rounded-full">
            <Cookie className="w-5 h-5 text-yellow-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-relaxed">
              Usamos cookies esenciales para que Timbiriche funcione correctamente.
              Sin publicidad, sin rastreo.{" "}
              <Link
                href="/privacidad"
                className="text-blue-600 font-medium hover:underline"
              >
                Más info
              </Link>
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
              >
                Aceptar
              </button>
              <button
                onClick={handleDecline}
                className="text-gray-500 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Rechazar
              </button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}