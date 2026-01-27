import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import { Settings } from "lucide-react";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const email = user.emailAddresses[0].emailAddress;

  // Buscamos si ya tiene perfil, si no, pasamos datos vacíos
  const seller = await prisma.seller.findUnique({
    where: { email },
  });

  const initialData = {
    storeName: seller?.storeName || user.firstName || "", // Usamos el nombre de Clerk como sugerencia
    phoneNumber: seller?.phoneNumber || "",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <Settings className="w-8 h-8 text-gray-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Configura tu Perfil</h1>
          <p className="text-gray-500 mt-2">
            Completa estos datos para que puedas recibir mensajes de compradores en WhatsApp.
          </p>
        </div>

        <ProfileForm initialData={initialData} />

      </div>
    </div>
  );
}