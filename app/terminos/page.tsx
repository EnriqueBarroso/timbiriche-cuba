import { Scale, Shield, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Términos y Condiciones</h1>
          <p className="text-gray-300">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Intro */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Importante</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Al usar Timbiriche, aceptas estos términos. Lee con atención antes de publicar o comprar.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          
          {/* Sección 1 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">1. Naturaleza del Servicio</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Timbiriche</strong> es una plataforma de anuncios clasificados que facilita el contacto 
                entre vendedores y compradores en Cuba. <strong>No procesamos pagos, no almacenamos mercancía 
                ni actuamos como intermediarios en las transacciones.</strong>
              </p>
              <p>
                Nuestra función es conectar a las partes. La negociación, pago y entrega ocurren directamente 
                entre el comprador y el vendedor, fuera de nuestra plataforma.
              </p>
            </div>
          </section>

          {/* Sección 2 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">2. Responsabilidades del Usuario</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>Como vendedor, te comprometes a:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Publicar productos legales y que realmente posees</li>
                <li>Proporcionar descripciones precisas y fotografías reales</li>
                <li>Cumplir con los acuerdos alcanzados con los compradores</li>
                <li>Responder de manera profesional y oportuna</li>
              </ul>

              <p className="pt-4"><strong>Como comprador, te comprometes a:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comunicarte de forma respetuosa con los vendedores</li>
                <li>Cumplir con los acuerdos de pago y recogida</li>
                <li>Verificar el estado del producto antes de pagar</li>
              </ul>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contenido Prohibido</h2>
            <div className="space-y-3 text-gray-700">
              <p>Está estrictamente prohibido publicar:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Productos ilegales (drogas, armas, documentos falsos)</li>
                <li>Contenido sexual explícito o servicios para adultos</li>
                <li>Artículos robados o de procedencia dudosa</li>
                <li>Animales en peligro de extinción</li>
                <li>Estafas, pirámides o esquemas fraudulentos</li>
              </ul>
              <p className="pt-3 font-bold">
                Nos reservamos el derecho de eliminar cualquier publicación que viole estas normas 
                sin previo aviso.
              </p>
            </div>
          </section>

          {/* Sección 4 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitación de Responsabilidad</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Timbiriche NO se hace responsable por:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La veracidad de la información publicada por los usuarios</li>
                <li>La calidad, estado o existencia real de los productos anunciados</li>
                <li>Disputas, fraudes o incumplimientos entre compradores y vendedores</li>
                <li>Pérdidas económicas derivadas de transacciones realizadas</li>
                <li>Daños o perjuicios causados por productos defectuosos</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-yellow-900 font-bold text-sm">
                  ⚠️ Recomendación: Verifica siempre el producto en persona antes de pagar. 
                  Evita realizar transferencias sin haber visto lo que compras.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 5 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Privacidad y Datos Personales</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Respetamos tu privacidad. Los datos que recopilamos (nombre, email, teléfono) 
                se usan únicamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitar la comunicación entre compradores y vendedores</li>
                <li>Mejorar nuestros servicios</li>
                <li>Enviar notificaciones importantes (si aceptas)</li>
              </ul>
              <p className="pt-3">
                <strong>No vendemos ni compartimos</strong> tus datos con terceros sin tu consentimiento.
              </p>
            </div>
          </section>

          {/* Sección 6 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modificaciones</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente tras su publicación en esta página.
              </p>
              <p>
                Es responsabilidad del usuario revisar periódicamente esta sección para mantenerse informado.
              </p>
            </div>
          </section>

          {/* Sección 7 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contacto</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Si tienes dudas sobre estos términos o deseas reportar contenido inapropiado, 
                contáctanos:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-bold mb-2">Email:</p>
                <a href="mailto:legal@timbiriche.cu" className="text-blue-600 hover:underline">
                  legal@timbiriche.cu
                </a>
                <p className="font-bold mt-4 mb-2">WhatsApp:</p>
                <a href="https://wa.me/1234567890" className="text-blue-600 hover:underline">
                  +53 1234 5678
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* Footer de la página */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Al usar Timbiriche, confirmas que has leído y aceptado estos términos.
          </p>
          <Link 
            href="/ayuda" 
            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
          >
            ¿Tienes dudas? Visita nuestra página de ayuda →
          </Link>
        </div>
      </div>
    </div>
  );
}