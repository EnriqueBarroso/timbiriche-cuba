// components/WhatsAppButton.tsx
import { MessageCircle } from "lucide-react";

interface Props {
  phoneNumber: string | null;
  productTitle: string;
}

export default function WhatsAppButton({ phoneNumber, productTitle }: Props) {
  
  // 1. Si no hay teléfono, mostramos un botón deshabilitado
  if (!phoneNumber) {
    return (
      <button disabled className="w-full py-3 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Sin teléfono de contacto
      </button>
    );
  }

  // 2. Limpiamos el número (quitamos +, espacios, guiones)
  // WhatsApp necesita el número limpio. Ej: 5355555555
  const cleanPhone = phoneNumber.replace(/\D/g, ''); 
  
  // 3. Preparamos el mensaje
  const message = `Hola! 👋 Vi tu anuncio *${productTitle}* en LaChopin y me interesa. ¿Sigue disponible?`;
  
  // 4. Creamos el link oficial de WhatsApp
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
    >
      <MessageCircle className="w-6 h-6" />
      Contactar por WhatsApp
    </a>
  );
}
