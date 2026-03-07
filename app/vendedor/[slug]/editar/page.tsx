import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Save, ArrowLeft, Clock, MapPin, Image as ImageIcon, Store } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function EditBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const ADMIN_EMAIL = "huberteatro@gmail.com";

  const seller = await prisma.seller.findUnique({
    where: { slug },
  });

  if (!seller) notFound();

  if (userEmail !== ADMIN_EMAIL && userEmail !== seller.email) {
    redirect("/");
  }

  async function updateBusiness(formData: FormData) {
    "use server";

    const data = {
      storeName: formData.get("storeName") as string,
      avatar: formData.get("avatar") as string,
      coverImage: formData.get("coverImage") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      address: formData.get("address") as string,
      openTime: formData.get("openTime") as string,
      closeTime: formData.get("closeTime") as string,
    };

    await prisma.seller.update({
      where: { slug },
      data,
    });

    redirect(`/vendedor/${slug}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header de navegación */}
        <div className="p-4 flex items-center gap-4 bg-white border-b border-gray-100 sticky top-0 z-50">
          <Link href={`/vendedor/${slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-black text-xl text-gray-900">Configurar Negocio</h1>
        </div>

        <form action={updateBusiness} className="p-4 space-y-6">
          
          {/* SECCIÓN 1: IDENTIDAD VISUAL */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <Store size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Identidad Visual</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nombre del Local</label>
                <input name="storeName" defaultValue={seller.storeName} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-blue-500">URL Imagen de Portada (Banner)</label>
                <div className="relative">
                   <ImageIcon className="absolute left-3 top-3.5 text-gray-300" size={18} />
                   <input name="coverImage" defaultValue={seller.coverImage || ""} placeholder="https://images.unsplash.com/..." className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-2xl text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-blue-500">URL Logo (Circular)</label>
                <div className="relative">
                   <Store className="absolute left-3 top-3.5 text-gray-300" size={18} />
                   <input name="avatar" defaultValue={seller.avatar || ""} placeholder="https://..." className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-2xl text-sm" />
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: DATOS DE CONTACTO Y LUGAR */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <MapPin size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Ubicación y Contacto</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Dirección Exacta</label>
                <input name="address" defaultValue={seller.address || ""} placeholder="Calle 23 e/ L y M, Vedado" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">WhatsApp de Pedidos</label>
                <input name="phoneNumber" defaultValue={seller.phoneNumber || ""} placeholder="535..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: HORARIOS */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <Clock size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Horario de Operación</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Apertura</label>
                <input name="openTime" type="time" defaultValue={seller.openTime || "10:00"} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Cierre</label>
                <input name="closeTime" type="time" defaultValue={seller.closeTime || "23:00"} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
            </div>
          </section>

          {/* BOTÓN GUARDAR */}
          <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={24} /> Guardar Cambios
          </button>

        </form>
      </div>
    </main>
  );
}