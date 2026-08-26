import type { Metadata } from "next";
import { MessageCircle, Store, Smartphone, Sparkles } from "lucide-react";

const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "¡Hola! Quiero solicitar mi tienda en LaChopin.",
);
const WHATSAPP_URL = `https://wa.me/5350000000?text=${WHATSAPP_MESSAGE}`;

export const metadata: Metadata = {
  title: "Solicita tu tienda",
  description:
    "Tu negocio con tienda online personalizada y pedidos por WhatsApp en LaChopin.",
};

const FEATURES = [
  {
    icon: Store,
    title: "Tu tienda, tu marca",
    description: "Página propia con tu logo, tu catálogo y tu horario.",
  },
  {
    icon: Smartphone,
    title: "Pedidos por WhatsApp",
    description: "Tus clientes piden directo por WhatsApp, sin intermediarios.",
  },
  {
    icon: Sparkles,
    title: "Sin complicaciones",
    description: "Nosotros configuramos tu tienda por ti, listo para empezar.",
  },
];

export default function VenderLandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
        <span
          className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
          style={{ color: TERRACOTTA, backgroundColor: `${TERRACOTTA}1A` }}
        >
          Para negocios
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">
          Lleva tu negocio a LaChopin
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl mx-auto">
          Creamos tu tienda online personalizada, con tu catálogo y tus datos de contacto,
          para que tus clientes te encuentren y pidan directo por WhatsApp.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12 text-left">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: `${TERRACOTTA}1A`, color: TERRACOTTA }}
              >
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all hover:brightness-105"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={24} /> Solicitar mi tienda por WhatsApp
        </a>

        <p className="text-sm text-gray-400 mt-4">
          Te contactamos en menos de 24 horas para configurar tu tienda.
        </p>
      </div>
    </div>
  );
}
