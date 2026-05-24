"use client";

import { useState } from "react";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/app/contacto/actions";

export default function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await sendContactEmail(formData);
    setPending(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("¡Mensaje enviado! Te responderemos pronto.");
      const form = document.querySelector("form") as HTMLFormElement;
      form.reset();
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Lado Izquierdo: Info */}
      <div className="bg-blue-600 p-8 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Estamos aquí para ayudarte</h2>
          <p className="text-blue-100 mb-8">
            ¿Tienes dudas sobre cómo vender o comprar? ¿Encontraste un error? Escríbenos.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-blue-200" />
              <span>hola@lachopin.com</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-blue-200" />
              <span>Cuba</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="p-8">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              id="name"
              name="name" 
              type="text" 
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Tu nombre" 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="tucorreo@ejemplo.com" 
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea 
              id="message"
              name="message" 
              rows={4} 
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="¿En qué podemos ayudarte?"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={pending}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Enviar Mensaje
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}