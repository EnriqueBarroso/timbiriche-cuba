import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Centro de Seguridad</h1>
        <p className="text-gray-600 mt-2">Tu seguridad es nuestra prioridad número uno.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <Lock className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Protección de Datos</h3>
          <p className="text-gray-600 text-sm">
            Tus datos están encriptados. Nunca compartimos tu información personal con terceros sin tu consentimiento.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <Eye className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Moderación Activa</h3>
          <p className="text-gray-600 text-sm">
            Revisamos los anuncios constantemente para eliminar contenido fraudulento, ilegal o engañoso.
          </p>
        </div>
      </div>

      <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Cómo evitar estafas</h2>
        </div>
        
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <p className="text-gray-700 text-sm">
              <span className="font-bold">Nunca envíes dinero por adelantado.</span> Desconfía de vendedores que piden transferencias antes de ver el producto.
            </p>
          </li>
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <p className="text-gray-700 text-sm">
              <span className="font-bold">Revisa el producto en persona.</span> Asegúrate de que funciona correctamente antes de pagar.
            </p>
          </li>
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <p className="text-gray-700 text-sm">
              <span className="font-bold">Cuidado con precios irreales.</span> Si algo parece demasiado bueno para ser verdad, probablemente sea una estafa.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}