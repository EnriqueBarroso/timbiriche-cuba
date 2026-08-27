"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero información sobre tener mi tienda en LaChopin",
);
// Exportado para reutilizar el mismo enlace/mensaje en otros CTAs de
// captación (ej. el slide del hero), en vez de duplicar la constante.
export const JOIN_WHATSAPP_URL = `https://wa.me/34666953174?text=${WHATSAPP_MESSAGE}`;

// sessionStorage (no localStorage): el pedido es que no reaparezca en la
// misma sesión de navegación, no que quede descartado para siempre.
// Clave compartida (no por página): si el usuario lo cierra en /tiendas,
// tampoco debe reaparecer en /eats dentro de la misma sesión.
const DISMISS_KEY = "join-lachopin-cta-dismissed";

interface Props {
  label?: string;
}

export default function JoinLaChopinFloatingCTA({
  label = "¿Tienes un negocio? Únete a LaChopin",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function checkDismissed() {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      if (!dismissed) setVisible(true);
    }
    checkDismissed();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    // bottom-24 en móvil deja espacio libre por encima de BottomNav (h-16,
    // fixed bottom-0) y de CookieNotice (bottom-20 md:bottom-4) para que
    // ninguno de los tres se solape.
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="relative">
        <a
          href={JOIN_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:brightness-105 active:scale-95 transition-all max-w-[230px] sm:max-w-xs"
        >
          <MessageCircle size={20} className="shrink-0" />
          <span className="text-sm font-bold leading-tight">{label}</span>
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-md border border-black/5 hover:text-gray-700 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
