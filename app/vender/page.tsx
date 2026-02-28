import Link from "next/link";
import { Zap, Wallet, Users, ArrowRight, Store, ShieldCheck } from "lucide-react";

export default function VenderLandingPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero: La Promesa */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-6">
          <Store size={14} /> ÚNETE A LOS +25 VENDEDORES
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
          Tu negocio merece una <br />
          <span className="text-blue-600">Tienda Profesional.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Deja de depender de grupos caóticos. Crea tu catálogo, gestiona tus seguidores y acepta pagos por Zelle en una sola plataforma.
        </p>
        <Link href="/vender/nuevo" className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95">
          Publicar mi primer anuncio <ArrowRight />
        </Link>
      </section>

      {/* Supply Hacking: ¿Por qué nosotros? */}
      <section className="max-w-6xl mx-auto py-12 px-4 grid md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all">
          <div className="p-3 bg-purple-100 rounded-2xl w-fit mb-6">
            <Wallet className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Zelle Friendly</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Configura tu cobro por Zelle y atrae clientes con familiares en el exterior. ¡Seguro y rápido!</p>
        </div>

        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all">
          <div className="p-3 bg-blue-100 rounded-2xl w-fit mb-6">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Sistema de Seguidores</h3>
          <p className="text-gray-600 text-sm leading-relaxed">No eres un anuncio más. Crea tu comunidad: cada vez que publiques, tus seguidores lo sabrán.</p>
        </div>

        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all">
          <div className="p-3 bg-amber-100 rounded-2xl w-fit mb-6">
            <Zap className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Rellenado Mágico</h3>
          <p className="text-gray-600 text-sm leading-relaxed">¿Ya tienes el anuncio en Revolico? Cópialo y pégalo. Nosotros rellenamos todo por ti en segundos.</p>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="max-w-4xl mx-auto mt-10 p-10 bg-gray-900 rounded-[40px] text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Potencia tu marca personal</h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">Más de 500 eventos registrados esta semana. No te quedes fuera del mercado digital más moderno de Cuba.</p>
          <Link href="/perfil" className="text-blue-400 font-bold hover:text-blue-300 flex items-center justify-center gap-2">
            Configurar mi perfil profesional <ArrowRight size={16} />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </section>
    </div>
  );
}