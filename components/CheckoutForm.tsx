// components/CheckoutForm.tsx
"use client"

import { useState } from "react";
import { z } from "zod";

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
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CheckoutFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // 2. Simular envío (Aquí luego conectaremos con WhatsApp o Base de Datos)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Éxito
    alert(`¡Pedido Confirmado!\nEnviaremos a: ${formData.address}`);
    setIsSubmitting(false);
    setFormData({ recipientName: "", phone: "", address: "" }); // Limpiar form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Datos de Entrega en Cuba</h2>
      
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
          className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all outline-none ${
            errors.recipientName ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500 focus:bg-white"
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
          className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all outline-none ${
            errors.phone ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500 focus:bg-white"
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
          className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border-2 transition-all outline-none resize-none ${
            errors.address ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500 focus:bg-white"
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
      >
        {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
      </button>
      
      <p className="text-xs text-center text-gray-400">
        El pago se coordina directamente con el vendedor tras confirmar.
      </p>
    </form>
  );
};