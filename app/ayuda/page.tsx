import { MessageCircle, Mail, HelpCircle, Package, Shield, CreditCard, Truck, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function AyudaPage() {
  const faqs = [
    {
      question: "¿Cómo compro un producto?",
      answer: "Navega por el catálogo, selecciona el producto que te interesa y haz clic en 'Contactar Vendedor'. Te redirigirá a WhatsApp para coordinar la compra directamente con el vendedor."
    },
    {
      question: "¿Puedo vender en Timbiriche?",
      answer: "¡Claro! Haz clic en 'Vender' en el menú principal, completa el formulario con los datos de tu producto y publícalo. Es gratis y toma menos de 2 minutos."
    },
    {
      question: "¿Cómo funciona el pago?",
      answer: "Timbiriche conecta compradores y vendedores. El pago y entrega se coordinan directamente entre ambas partes a través de WhatsApp. Puedes pagar en efectivo, transferencia bancaria o la modalidad que acuerden."
    },
    {
      question: "¿Timbiriche cobra comisión?",
      answer: "No. Timbiriche es completamente gratuito tanto para compradores como vendedores. Nuestro objetivo es facilitar el comercio en Cuba."
    },
    {
      question: "¿Qué hago si hay un problema con mi compra?",
      answer: "Intenta resolver directamente con el vendedor a través de WhatsApp. Si el problema persiste, contáctanos y haremos lo posible por mediar."
    },
    {
      question: "¿Cómo elimino o edito mi publicación?",
      answer: "Ve a 'Mis Publicaciones' en tu perfil. Desde ahí puedes editar o eliminar cualquiera de tus productos activos."
    }
  ];

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      description: "Respuesta en menos de 24h",
      action: "Chatear ahora",
      href: "https://wa.me/1234567890", // Reemplaza con tu número
      color: "green"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "soporte@timbiriche.cu",
      action: "Enviar email",
      href: "mailto:soporte@timbiriche.cu",
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">¿Cómo podemos ayudarte?</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Encuentra respuestas rápidas a tus dudas o contáctanos directamente
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Preguntas Frecuentes</h2>
          <p className="text-gray-600">Las dudas más comunes de nuestra comunidad</p>
        </div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-xl p-6 border border-gray-100 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <FileQuestion className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  {faq.question}
                </span>
                <svg 
                  className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed pl-8">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Temas de Ayuda */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorar por Tema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Package className="w-6 h-6" />, title: "Comprar productos", desc: "Guías para compradores" },
              { icon: <Shield className="w-6 h-6" />, title: "Seguridad", desc: "Compra y vende seguro" },
              { icon: <CreditCard className="w-6 h-6" />, title: "Pagos", desc: "Métodos de pago aceptados" },
              { icon: <Truck className="w-6 h-6" />, title: "Entregas", desc: "Cómo coordinar envíos" }
            ].map((topic, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métodos de Contacto */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">¿Aún necesitas ayuda?</h2>
          <p className="text-gray-600 text-center mb-8">Nuestro equipo está disponible para asistirte</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {contactMethods.map((method, i) => (
              <a 
                key={i}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white rounded-xl p-6 border-2 border-${method.color}-100 hover:border-${method.color}-300 hover:shadow-lg transition-all group`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${method.color}-50 rounded-full mb-4 text-${method.color}-600`}>
                  {method.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                <span className={`text-${method.color}-600 font-bold text-sm group-hover:underline`}>
                  {method.action} →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Link a Términos */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            ¿Buscas información legal?{" "}
            <Link href="/terminos" className="text-blue-600 font-bold hover:underline">
              Lee nuestros Términos y Condiciones
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}