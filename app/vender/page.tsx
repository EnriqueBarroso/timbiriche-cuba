import Link from "next/link";
import { Zap, Wallet, Users, ArrowRight, Store, ShieldCheck, Utensils } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function VenderLandingPage() {
  const user = await currentUser();

  // 1. Si no hay usuario logueado, lo mandamos a iniciar sesión
  if (!user) {
    redirect("/sign-in");
  }

  // Buscamos si el usuario ya tiene su tienda creada en la base de datos
  const seller = await prisma.seller.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
  });

  // 👇 EL GUARDIA DE SEGURIDAD 🛡️
  // Si NO tiene tienda, lo mandamos obligatoriamente a elegir su tarjeta gigante
  if (!seller) {
    redirect("/perfil");
  }

  // Si el código llega hasta aquí, significa que SÍ tiene tienda.
  // Ya podemos saber con seguridad si es restaurante o no.
  const isRestaurant = seller.isRestaurant;

  // Variables dinámicas para el botón principal
  const ctaLink = isRestaurant ? "/vender/nuevo-plato" : "/vender/nuevo";
  const ctaText = isRestaurant ? "Añadir plato al menú" : "Publicar mi primer anuncio";
  const ctaIcon = isRestaurant ? <Utensils size={24} /> : <ArrowRight />;
  const ctaColor = isRestaurant 
    ? "bg-[#D32F2F] hover:bg-red-700 shadow-red-200" 
    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200";

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero: La Promesa */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-6">
          <Store size={14} /> ÚNETE A LOS +25 VENDEDORES
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
          Tu negocio merece una <br />
          <span className={isRestaurant ? "text-[#D32F2F]" : "text-blue-600"}>
            {isRestaurant ? "Carta Digital." : "Tienda Profesional."}
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          {isRestaurant 
            ? "Olvídate de los PDFs. Sube tus platos, recibe pedidos por WhatsApp y haz crecer tu restaurante." 
            : "Deja de depender de grupos caóticos. Crea tu catálogo, gestiona tus seguidores y acepta pagos por Zelle en una sola plataforma."}
        </p>
        
        {/* BOTÓN MÁGICO QUE CAMBIA SEGÚN EL ROL */}
        <Link href={ctaLink} className={`inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl active:scale-95 ${ctaColor}`}>
          {ctaText} {ctaIcon}
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
          <h3 className="text-xl font-bold text-gray-900 mb-3">{isRestaurant ? "Pedidos Inmediatos" : "Rellenado Mágico"}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {isRestaurant ? "Recibe la orden detallada con totales y productos directamente en tu WhatsApp." : "¿Ya tienes el anuncio en Revolico? Cópialo y pégalo. Nosotros rellenamos todo por ti en segundos."}
          </p>
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