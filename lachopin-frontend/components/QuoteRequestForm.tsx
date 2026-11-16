"use client";

import type { FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { getLaChopinWhatsAppUrl } from "@/lib/contact";

export default function QuoteRequestForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = [
      ["Nombre", formData.get("name")],
      ["Negocio", formData.get("business")],
      ["Sector", formData.get("sector")],
      ["Localidad en Cuba", formData.get("location")],
      ["Productos aproximados", formData.get("products")],
      ["Quién realiza el pago", formData.get("payer")],
      ["Modalidad", formData.get("delivery")],
      ["Contacto", formData.get("contact")],
      ["Detalles", formData.get("details")],
    ];

    const message = [
      "Hola, quiero solicitar un presupuesto para una tienda digital con LaChopin.",
      "",
      ...fields.map(([label, value]) => `${label}: ${String(value || "No indicado")}`),
    ].join("\n");

    window.open(getLaChopinWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-gray-900">Solicita tu presupuesto</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cuéntanos qué necesita tu negocio. Revisaremos la solicitud contigo por WhatsApp.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tu nombre" name="name" required placeholder="Nombre y apellidos" />
        <Field label="Nombre del negocio" name="business" required placeholder="Cómo se llama tu negocio" />
        <Field label="Sector" name="sector" required placeholder="Ej. restaurante, tienda, servicios" />
        <Field label="Localidad en Cuba" name="location" required placeholder="Municipio y provincia" />
        <Field label="Número aproximado de productos" name="products" placeholder="Ej. 30, 100 o no aplica" />
        <div>
          <label htmlFor="payer" className="mb-1 block text-sm font-medium text-gray-700">¿Quién realizará el pago?</label>
          <select id="payer" name="payer" defaultValue="Propietario o negocio en Cuba" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option>Propietario o negocio en Cuba</option>
            <option>Familiar o propietario desde el exterior</option>
            <option>Aún por definir</option>
          </select>
        </div>
        <div>
          <label htmlFor="delivery" className="mb-1 block text-sm font-medium text-gray-700">Modalidad deseada</label>
          <select id="delivery" name="delivery" defaultValue="Gestionada por LaChopin" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option>Gestionada por LaChopin</option>
            <option>Entrega para gestionar por mi cuenta</option>
            <option>Necesito asesoramiento</option>
          </select>
        </div>
        <Field label="WhatsApp o correo de contacto" name="contact" required placeholder="Tu medio de contacto" />
      </div>

      <div>
        <label htmlFor="details" className="mb-1 block text-sm font-medium text-gray-700">¿Qué necesitas?</label>
        <textarea id="details" name="details" rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" placeholder="Describe tu tienda, catálogo o funcionalidades que necesitas." />
      </div>

      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B84C24] px-5 py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-60">
        <MessageCircle size={18} />
        Enviar solicitud por WhatsApp
      </button>
      <p className="text-xs leading-relaxed text-gray-400">
        Al continuar se abrirá WhatsApp con los datos que has escrito para que puedas revisarlos y enviarlos. No se guardan en esta web.
      </p>
    </form>
  );
}

function Field({ label, name, required = false, placeholder }: { label: string; name: string; required?: boolean; placeholder: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input id={name} name={name} required={required} placeholder={placeholder} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#B84C24] focus:ring-2 focus:ring-[#B84C24]/15" />
    </div>
  );
}
