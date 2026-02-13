import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Política de Cookies</h1>
      </div>
      
      <div className="prose prose-blue max-w-none text-gray-600">
        <p className="lead text-lg mb-6">
          En <strong>LaChopin</strong> usamos cookies para mejorar tu experiencia. No son para comérselas, sino pequeños archivos de datos que nos ayudan a que la web funcione mejor para ti.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">¿Qué son las cookies?</h3>
        <p className="mb-4">
          Una cookie es un pequeño fichero de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">¿Qué cookies usamos?</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Cookies Técnicas:</strong> Son necesarias para que puedas iniciar sesión, añadir productos a favoritos o completar una compra. Sin ellas, la web no funcionaría bien.</li>
          <li><strong>Cookies de Análisis:</strong> Nos ayudan a entender qué productos son los más visitados o desde qué provincias nos visitan más, para mejorar nuestro servicio.</li>
          <li><strong>Cookies de Preferencias:</strong> Recuerdan si prefieres ver la web en modo claro u oscuro, o tus búsquedas recientes.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">¿Cómo desactivarlas?</h3>
        <p className="mb-4">
          Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador o celular.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
          <p className="text-sm text-gray-500 mb-4">
            Si tienes dudas sobre nuestra política de cookies, puedes contactarnos en cualquier momento.
          </p>
          <Link href="/contacto" className="text-blue-600 font-bold hover:underline">
            Ir a Contacto &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}