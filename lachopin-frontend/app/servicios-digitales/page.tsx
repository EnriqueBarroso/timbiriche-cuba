import type { Metadata } from "next";
import Link from "next/link";
import { Check, Globe, LayoutDashboard, Smartphone, Wrench } from "lucide-react";
import QuoteRequestForm from "@/components/QuoteRequestForm";

const TERRACOTTA = "#B84C24";

export const metadata: Metadata = {
  title: "Servicios digitales para negocios en Cuba",
  description: "Diseñamos y desarrollamos páginas web, catálogos y tiendas digitales para negocios en Cuba.",
};

const services = [
  { icon: Globe, title: "Presencia digital", description: "Una página profesional para presentar tu negocio, ubicación, servicios y formas de contacto." },
  { icon: LayoutDashboard, title: "Catálogo o tienda", description: "Productos organizados por categorías, fotografías, descripciones y contacto directo con tus clientes." },
  { icon: Smartphone, title: "Diseño para móviles", description: "Una experiencia clara y ligera para que tus clientes puedan consultar tu negocio desde el teléfono." },
  { icon: Wrench, title: "Acompañamiento técnico", description: "Alojamiento, actualizaciones y mantenimiento, cuando estén incluidos en la modalidad contratada." },
];

const packages = [
  { name: "Presencia Digital", audience: "Profesionales y pequeños negocios", features: ["Página de presentación", "Información y contacto", "Diseño adaptable a móviles"] },
  { name: "Tienda Digital", audience: "Comercios que necesitan mostrar un catálogo", featured: true, features: ["Todo lo de Presencia Digital", "Catálogo organizado", "Hasta 30 productos iniciales", "Contacto directo por WhatsApp"] },
  { name: "Tienda Personalizada", audience: "Negocios con necesidades específicas", features: ["Diseño y estructura a medida", "Funcionalidades según alcance", "Integraciones evaluadas por proyecto"] },
];

export default function ServiciosDigitalesPage() {
  return (
    <main className="min-h-screen bg-[#FBF3EA]">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="mb-5 inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-widest" style={{ color: TERRACOTTA, backgroundColor: "#B84C241A" }}>
            Servicios digitales para Cuba
          </span>
          <h1 className="text-4xl font-black leading-tight text-gray-950 md:text-6xl">
            Tu negocio merece una buena presencia en Internet.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            En LaChopin diseñamos páginas web, catálogos y tiendas digitales para que tus clientes conozcan lo que ofreces y puedan contactar directamente contigo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#presupuesto" className="rounded-xl px-6 py-3 font-bold text-white shadow-lg transition hover:brightness-110" style={{ backgroundColor: TERRACOTTA }}>Solicitar presupuesto</a>
            <Link href="/tiendas" className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-gray-800 transition hover:bg-gray-50">Explorar LaChopin</Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ color: TERRACOTTA, backgroundColor: "#B84C241A" }}><Icon size={22} /></div>
              <h2 className="mb-2 font-bold text-gray-900">{title}</h2>
              <p className="text-sm leading-relaxed text-gray-500">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-9 max-w-2xl">
            <h2 className="text-3xl font-black text-gray-950">Una solución adecuada a tu negocio</h2>
            <p className="mt-3 text-gray-600">Empezamos por entender qué necesitas y te enviamos una propuesta con alcance, precio, plazos y responsabilidades definidos.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map((item) => (
              <article key={item.name} className={`relative rounded-2xl border p-6 ${item.featured ? "border-[#B84C24] shadow-lg" : "border-gray-200"}`}>
                {item.featured && <span className="mb-3 inline-flex rounded-full bg-[#B84C24]/10 px-3 py-1 text-xs font-bold text-[#B84C24]">Oferta principal</span>}
                <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
                <p className="mt-2 min-h-10 text-sm text-gray-500">{item.audience}</p>
                <ul className="mt-5 space-y-3">
                  {item.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-gray-700"><Check size={17} className="shrink-0 text-green-600" />{feature}</li>)}
                </ul>
                <a href="#presupuesto" className="mt-7 inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: TERRACOTTA }}>Solicitar propuesta</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]" id="presupuesto">
        <div>
          <h2 className="text-3xl font-black text-gray-950">Cuéntanos qué necesita tu negocio</h2>
          <p className="mt-4 leading-relaxed text-gray-600">Puedes contratar desde Cuba o coordinar el proyecto con un familiar o propietario que se encuentre en el exterior. La modalidad de gestión y entrega se acuerda antes de comenzar.</p>
          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
            <h3 className="font-bold text-gray-900">Antes de empezar, definimos por escrito:</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Qué páginas y funcionalidades se incluyen.</li>
              <li>• Quién aporta textos, imágenes y datos del negocio.</li>
              <li>• Quién administra dominio, alojamiento y accesos.</li>
              <li>• Qué soporte y mantenimiento se contratan.</li>
            </ul>
          </div>
        </div>
        <QuoteRequestForm />
      </section>
    </main>
  );
}
