import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contáctanos</h1>

      <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Información de Contacto */}
        <div className="bg-blue-600 p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Estamos aquí para ayudarte</h2>
            <p className="text-blue-100 mb-8">
              ¿Tienes dudas sobre cómo vender o comprar? ¿Encontraste un error? Escríbenos y te responderemos lo antes posible.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-blue-200" />
                <span>hola@lachopin.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-blue-200" />
                <span>+53 5 123 4567</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-blue-200" />
                <span>La Habana, Cuba</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-blue-200">Horario de atención:</p>
            <p className="font-semibold">Lunes a Sábado, 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Formulario Visual (Sin backend por ahora) */}
        <div className="p-8">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Enviar Mensaje
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}