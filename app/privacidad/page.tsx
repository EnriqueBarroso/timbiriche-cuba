import { Eye, Shield, Database, Cookie, UserCheck, Trash2, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo Timbiriche Cuba recopila, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Eye className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Política de Privacidad</h1>
          <p className="text-gray-300">
            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
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
              <h3 className="font-bold text-blue-900 mb-2">Tu privacidad importa</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                En Timbiriche nos tomamos en serio la protección de tus datos personales.
                Esta política explica qué información recopilamos, cómo la usamos y cuáles son tus derechos.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">

          {/* Sección 1 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">1. Datos que Recopilamos</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Cuando usas Timbiriche, podemos recopilar la siguiente información:</p>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">Datos de cuenta (al registrarte):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombre y apellido</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Foto de perfil (si la proporcionas)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">Datos de vendedor (al publicar productos):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombre de tienda</li>
                  <li>Número de teléfono / WhatsApp</li>
                  <li>Avatar personalizado</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">Datos generados por tu uso:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Productos publicados (título, descripción, imágenes, precio)</li>
                  <li>Lista de favoritos</li>
                  <li>Interacciones con la plataforma</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 2 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">2. Cómo Usamos tus Datos</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Utilizamos la información recopilada exclusivamente para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crear y mantener tu cuenta de usuario</li>
                <li>Mostrar tu perfil de vendedor a compradores interesados</li>
                <li>Facilitar la comunicación entre compradores y vendedores vía WhatsApp</li>
                <li>Mostrar y gestionar tus productos publicados</li>
                <li>Mejorar el funcionamiento y la experiencia de la plataforma</li>
                <li>Prevenir fraudes y contenido inapropiado</li>
              </ul>
              <p className="pt-3">
                <strong>No usamos tus datos para publicidad dirigida, ni los vendemos a terceros.</strong>
              </p>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Servicios de Terceros</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Para ofrecerte el mejor servicio, utilizamos proveedores externos que pueden
                procesar parte de tus datos. Cada uno tiene su propia política de privacidad:
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-bold text-gray-900">Clerk</p>
                  <p className="text-sm text-gray-600">Autenticación y gestión de cuentas de usuario</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-bold text-gray-900">Supabase</p>
                  <p className="text-sm text-gray-600">Base de datos (productos, vendedores, favoritos)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-bold text-gray-900">Cloudinary</p>
                  <p className="text-sm text-gray-600">Almacenamiento y optimización de imágenes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-bold text-gray-900">Vercel</p>
                  <p className="text-sm text-gray-600">Hosting y distribución de la plataforma</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 pt-2">
                Estos servicios están alojados en servidores fuera de Cuba. Al usar Timbiriche,
                aceptas que tus datos puedan ser procesados en estos servidores internacionales.
              </p>
            </div>
          </section>

          {/* Sección 4 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">4. Cookies</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Timbiriche utiliza cookies para:</p>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">Cookies esenciales:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Sesión de usuario</strong> — Mantener tu sesión activa mientras navegas (gestionada por Clerk)</li>
                  <li><strong>Preferencias</strong> — Recordar ajustes básicos de la plataforma</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">Cookies analíticas (opcionales):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Vercel Analytics</strong> — Datos anónimos de rendimiento y uso para mejorar la plataforma</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500">
                No utilizamos cookies de publicidad ni de rastreo de terceros.
              </p>
            </div>
          </section>

          {/* Sección 5 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">5. Tus Derechos</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Como usuario de Timbiriche, tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acceso:</strong> Solicitar una copia de los datos que tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> Corregir datos incorrectos desde tu perfil o contactándonos</li>
                <li><strong>Eliminación:</strong> Solicitar que eliminemos tu cuenta y datos asociados</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en un formato legible</li>
              </ul>
              <p className="pt-3">
                Para ejercer cualquiera de estos derechos, escríbenos a la dirección
                de contacto indicada al final de esta página.
              </p>
            </div>
          </section>

          {/* Sección 6 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">6. Retención de Datos</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Conservamos tus datos mientras tu cuenta esté activa. Si decides eliminar tu cuenta:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tus productos publicados serán eliminados</li>
                <li>Tu perfil de vendedor dejará de ser visible</li>
                <li>Tus datos personales serán borrados de nuestra base de datos en un plazo de 30 días</li>
                <li>Las imágenes subidas a Cloudinary serán eliminadas</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-yellow-900 font-bold text-sm">
                  ⚠️ Nota: Algunos datos anonimizados pueden conservarse con fines estadísticos,
                  pero nunca serán vinculables a tu persona.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 7 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Seguridad</h2>
            <div className="space-y-3 text-gray-700">
              <p>Tomamos medidas razonables para proteger tus datos, incluyendo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conexiones cifradas (HTTPS) en toda la plataforma</li>
                <li>Autenticación segura a través de Clerk</li>
                <li>Base de datos protegida con acceso restringido</li>
                <li>Revisión periódica de vulnerabilidades</li>
              </ul>
              <p className="pt-3 text-sm text-gray-500">
                Ningún sistema es 100% seguro. Si detectas alguna vulnerabilidad,
                te agradecemos que nos lo comuniques de forma responsable.
              </p>
            </div>
          </section>

          {/* Sección 8 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Menores de Edad</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Timbiriche no está dirigido a menores de 16 años. No recopilamos
                intencionalmente datos de menores. Si descubrimos que un menor ha
                creado una cuenta, la eliminaremos junto con sus datos.
              </p>
            </div>
          </section>

          {/* Sección 9 */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cambios en esta Política</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Publicaremos
                cualquier cambio en esta página con la fecha de actualización correspondiente.
                Te recomendamos revisarla periódicamente.
              </p>
            </div>
          </section>

          {/* Sección 10 - Contacto */}
          <section className="bg-white rounded-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">10. Contacto</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Si tienes preguntas sobre esta política o quieres ejercer tus derechos
                sobre tus datos, contáctanos:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-bold mb-2">Email:</p>
                <a href="mailto:privacidad@timbiriche.cu" className="text-blue-600 hover:underline">
                  privacidad@timbiriche.cu
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
            Esta política complementa nuestros{" "}
            <Link href="/terminos" className="text-blue-600 font-bold hover:underline">
              Términos y Condiciones
            </Link>.
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