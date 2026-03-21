import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import { Settings, Store, UtensilsCrossed, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ role?: string }>;
}

export default async function ProfilePage({ searchParams }: Props) {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0].emailAddress;

  const seller = await prisma.seller.findUnique({
    where: { email },
  });

  const resolvedSearchParams = await searchParams;
  const role = resolvedSearchParams.role;

  // 🛑 LA MAGIA AQUÍ: Si es un usuario nuevo y no ha elegido rol, mostramos las tarjetas
  if ((!seller || !seller.phoneNumber) && !role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              ¿Qué vas a vender en LaChopin?
            </h1>
            <p className="text-lg text-gray-500">
              Elige tu tipo de negocio para adaptar tu experiencia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* TARJETA 1: Tienda Tradicional */}
            <Link 
              href="/perfil?role=store"
              className="group bg-white rounded-[2rem] p-8 border-2 border-transparent hover:border-blue-500 shadow-lg hover:shadow-blue-100 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center cursor-pointer active:scale-95"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Store className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Tienda Tradicional</h2>
              <p className="text-gray-500 mb-8">
                Ideal para vender ropa, tecnología, vehículos, electrodomésticos y artículos físicos.
              </p>
              <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                Crear Tienda <ArrowRight size={20} />
              </div>
            </Link>

            {/* TARJETA 2: Restaurante / Gastronomía */}
            <Link 
              href="/perfil?role=restaurant"
              className="group bg-white rounded-[2rem] p-8 border-2 border-transparent hover:border-[#D32F2F] shadow-lg hover:shadow-red-100 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center cursor-pointer active:scale-95"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <UtensilsCrossed className="w-10 h-10 text-[#D32F2F]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Restaurante / Comida</h2>
              <p className="text-gray-500 mb-8">
                Crea tu menú digital interactivo y recibe los pedidos de tus clientes directamente en WhatsApp.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[#D32F2F] font-bold group-hover:translate-x-2 transition-transform">
                Crear Menú Digital <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si ya es vendedor, o ya eligió su rol, preparamos la variable
 const isRestaurant = role === "restaurant" || (seller?.isRestaurant ?? false);

  // Añadimos el nuevo dato a initialData
  const initialData = {
    storeName: seller?.storeName || user.firstName || "",
    phoneNumber: seller?.phoneNumber || "",
    avatar: seller?.avatar || user.imageUrl || "",
    acceptsZelle: seller?.acceptsZelle || false,
    zelleEmail: seller?.zelleEmail || "",
    // 👇 ¡Aquí le pasamos el rol al formulario!
    isRestaurant: isRestaurant, 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            {isRestaurant ? (
              <UtensilsCrossed className="w-8 h-8 text-[#D32F2F]" />
            ) : (
              <Settings className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isRestaurant ? "Configura tu Restaurante" : "Mi Perfil de Vendedor"}
          </h1>
          <p className="text-gray-500 mt-2">
            {isRestaurant 
              ? "Añade el WhatsApp donde recibirás los pedidos" 
              : "Configura tu información de contacto y métodos de pago"}
          </p>
        </div>
        
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}