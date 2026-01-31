"use client";

import { useState } from "react";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext"; // 👈 Importamos el carrito
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

// Validaciones para Cuba
const checkoutSchema = z.object({
  recipientName: z
    .string()
    .min(2, "El nombre es muy corto")
    .max(100),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .regex(/^[0-9+\-\s]+$/, "Solo números y símbolos +"),
  address: z
    .string()
    .min(10, "La dirección es muy corta (incluye calle, número y municipio)"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  // Conectamos con el Carrito Global
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState<CheckoutFormData>({
    recipientName: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Validar datos
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CheckoutFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // 2. VERIFICAR QUE HAYA ITEMS
    if (items.length === 0) {
      alert("El carrito está vacío");
      setIsSubmitting(false);
      return;
    }

    // 3. LOGICA DE WHATSAPP REAL 🟢
    
    // ⚠️ IMPORTANTE: Pon aquí tu número de teléfono (Admin) con código de país
    // O usa una variable de entorno: process.env.NEXT_PUBLIC_ADMIN_PHONE
    const ADMIN_PHONE = "5300000000"; // <--- ¡CAMBIA ESTO POR TU NÚMERO!

    // Construimos el mensaje (Ticket de compra)
    let message = `*¡NUEVO PEDIDO DE TIMBIRICHE!* 🇨🇺\n\n`;
    
    message += `👤 *Cliente:* ${formData.recipientName}\n`;
    message += `📞 *Contacto:* ${formData.phone}\n`;
    message += `📍 *Dirección:* ${formData.address}\n\n`;
    
    message += `🛒 *DETALLE DEL PEDIDO:*\n`;
    items.forEach((item) => {
       // Usamos un emoji o marcador para separar
       message += `▪️ ${item.quantity}x ${item.title} - $${item.price * item.quantity}\n`;
       // Si quieres incluir el vendedor:
       // message += `   (Vendedor: ${item.seller?.storeName || 'Desconocido'})\n`;
    });

    message += `\n💰 *TOTAL A PAGAR: $${cartTotal}*`;
    message += `\n\n_Enviado desde la web de Timbiriche_`;

    // 4. Redirigir a WhatsApp
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
    
    // Abrimos en nueva pestaña
    window.open(whatsappUrl, '_blank');

    // 5. Limpieza final
    clearCart(); // Vaciamos el carrito visualmente
    alert("¡Pedido enviado a WhatsApp! Nos pondremos en contacto contigo pronto.");
    router.push("/"); // Volvemos al inicio
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-full">
           <MessageCircle className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Finalizar Compra</h2>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Nombre de quien recibe
        </label>
        <input
          type="text"
          value={formData.recipientName}
          onChange={(e) => handleChange("recipientName", e.target.value)}
          placeholder="Ej: María Pérez"
          className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all outline-none ${errors.recipientName ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500 focus:bg-white"
            }`}
        />
        {errors.recipientName && (
          <p className="text-xs text-red-500 mt-1 font-bold">{errors.recipientName}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Teléfono / WhatsApp
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Ej: +53 5 123 4567"
          className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all outline-none ${errors.phone ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500 focus:bg-white"
            }`}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1 font-bold">{errors.phone}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Dirección exacta
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Ej: Calle 23 #456, Apto 2, Vedado, La Habana"
          rows={3}
          className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all outline-none resize-none ${errors.address ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500 focus:bg-white"
            }`}
        />
        {errors.address && (
          <p className="text-xs text-red-500 mt-1 font-bold">{errors.address}</p>
        )}
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl text-lg transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Procesando..." : (
            <>
                <span>Enviar Pedido por WhatsApp</span>
                <MessageCircle className="w-6 h-6" />
            </>
        )}
      </button>

      <p className="text-xs text-center text-gray-400 mt-4">
        Al hacer clic, se abrirá WhatsApp con el resumen de tu pedido para coordinar el pago y la entrega.
      </p>
    </form>
  );
};