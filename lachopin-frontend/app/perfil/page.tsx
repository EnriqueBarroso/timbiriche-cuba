import { currentUser } from "@clerk/nextjs/server";
import { getBusinessByOwnerId } from "@/lib/api";
import { redirect } from "next/navigation";
import { MessageCircle, Store } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/34666953174?text=Hola%2C%20quiero%20información%20sobre%20tener%20mi%20tienda%20en%20LaChopin";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) return null;

  const business = await getBusinessByOwnerId(user.id).catch(() => null);

  // Las tiendas se dan de alta manualmente desde el panel de admin — este
  // usuario ya tiene una, así que lo mandamos directo a su editor real en
  // vez de duplicar el formulario aquí.
  if (business?.slug) {
    redirect(`/vendedor/${business.slug}/editar`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Store className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">
          Aún no tienes una tienda en LaChopin
        </h1>
        <p className="text-gray-500 mb-8">
          Las tiendas se configuran directamente por nuestro equipo — contáctanos para tener la tuya.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-black text-base shadow-lg shadow-green-900/10 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <MessageCircle size={20} /> Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
