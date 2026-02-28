import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import { Settings } from "lucide-react";

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) return null; 

  const email = user.emailAddresses[0].emailAddress;

  const seller = await prisma.seller.findUnique({
    where: { email },
  });

  const initialData = {
    storeName: seller?.storeName || user.firstName || "",
    phoneNumber: seller?.phoneNumber || "",
    avatar: seller?.avatar || user.imageUrl || "",
    // 👇 Añadimos los datos de Zelle
    acceptsZelle: seller?.acceptsZelle || false,
    zelleEmail: seller?.zelleEmail || "",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <Settings className="w-8 h-8 text-gray-700" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mi Perfil de Vendedor</h1>
          <p className="text-gray-500 mt-2">Configura tu información de contacto y métodos de pago</p>
        </div>
        
        {/* @ts-ignore - Ignoramos el error de tipos temporalmente hasta que el formulario se actualice */}
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}