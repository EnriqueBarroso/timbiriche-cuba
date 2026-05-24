import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Tienes dudas o sugerencias? Contáctanos y te responderemos lo antes posible.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contáctanos</h1>
      <ContactForm />
    </div>
  );
}