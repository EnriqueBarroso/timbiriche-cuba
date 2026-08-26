import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageCircle,
  Store,
  Smartphone,
  Sparkles,
  User,
  ImagePlus,
  Pencil,
  Power,
  Settings,
} from "lucide-react";

const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "¡Hola! Quiero solicitar mi tienda en LaChopin.",
);
const WHATSAPP_URL = `https://wa.me/5350000000?text=${WHATSAPP_MESSAGE}`;

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Qué es LaChopin y cómo gestionar tu catálogo si ya tienes tu tienda con nosotros.",
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
    title: "Mantenimiento incluido",
    description: "Nosotros mantenemos tu tienda funcionando, tú solo atiendes pedidos.",
  },
];

const STEPS = [
  {
    icon: User,
    title: "Entra a \"Mis Productos\"",
    description:
      "Toca tu foto de perfil arriba a la derecha y elige \"Mis Productos\" en el menú de cuenta.",
  },
  {
    icon: ImagePlus,
    title: "Agrega un producto con foto",
    description:
      "Pulsa \"Agregar producto\", sube hasta 5 fotos desde tu teléfono u ordenador y completa nombre, precio, categoría y descripción.",
  },
  {
    icon: Pencil,
    title: "Edítalo cuando quieras",
    description:
      "Toca el ícono de lápiz en cualquier producto de tu lista para cambiar sus datos o sus fotos.",
  },
  {
    icon: Power,
    title: "Activa o desactiva disponibilidad",
    description:
      "Usa el ícono de encendido junto a cada producto para marcarlo como disponible o vendido, al instante.",
  },
  {
    icon: Settings,
    title: "Actualiza tu logo y portada",
    description:
      "En el menú de cuenta, entra a \"Configurar Negocio\" para subir un nuevo logo o imagen de portada, o pegar una URL si ya la tienes alojada.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      {/* SECCIÓN A — Qué es LaChopin */}
      <section className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
        <span
          className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
          style={{ color: TERRACOTTA, backgroundColor: `${TERRACOTTA}1A` }}
        >
          Qué es LaChopin
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">
          Tu tienda online, sin complicaciones
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl mx-auto">
          LaChopin le da a tu negocio una tienda online personalizada, con tu catálogo
          y tus datos de contacto, para que tus clientes te encuentren y pidan directo
          por WhatsApp.
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
      </section>

      {/* SECCIÓN B — Guía para dueños de negocio activos */}
      <section id="guia" className="bg-white border-t border-black/5 scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <span
              className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
              style={{ color: TERRACOTTA, backgroundColor: `${TERRACOTTA}1A` }}
            >
              Ya tienes tu tienda
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Cómo gestionar tu catálogo
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Una guía rápida para usar tu panel de negocio, paso a paso.
            </p>
          </div>

          <ol className="space-y-4">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="flex gap-4 bg-gray-50 rounded-2xl border border-black/5 p-5"
              >
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                    style={{ backgroundColor: TERRACOTTA, color: "white" }}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} style={{ color: TERRACOTTA }} />
                    <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="text-center text-sm text-gray-400 mt-10">
            ¿Tienes dudas sobre tu tienda?{" "}
            <Link href="/ayuda" className="font-bold hover:underline" style={{ color: TERRACOTTA }}>
              Visita soporte
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
