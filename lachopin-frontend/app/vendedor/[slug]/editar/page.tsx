import { notFound, redirect } from "next/navigation";
import { getBusinessBySlug, getBusinessByOwnerId, updateBusiness as apiUpdateBusiness } from "@/lib/api";
import { Save, ArrowLeft, Clock, MapPin, Store, DollarSign } from "lucide-react";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/utils";
import ImageOrUrlField from "./ImageOrUrlField";

export default async function EditBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const [business, currentBusiness] = await Promise.all([
    getBusinessBySlug(slug).catch(() => null),
    user ? getBusinessByOwnerId(user.id) : Promise.resolve(null),
  ]);

  if (!business) notFound();

  if (!isAdmin(userEmail) && currentBusiness?.id !== business.id) {
    redirect("/");
  }

  const businessId = business.id;

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
      cupExchangeRate: formData.get("cupExchangeRate")
        ? Number(formData.get("cupExchangeRate"))
        : undefined,
    };

    const { getToken } = await auth();
    const token = await getToken();
    await apiUpdateBusiness(businessId, data, token ?? undefined);
    redirect(`/vendedor/${slug}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-2xl mx-auto">

        <div className="p-4 flex items-center gap-4 bg-white border-b border-gray-100 sticky top-0 z-50">
          <Link href={`/vendedor/${slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-black text-xl text-gray-900">Configurar Negocio</h1>
        </div>

        <form action={updateBusiness} className="p-4 space-y-6">

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <Store size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Identidad Visual</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nombre del Local</label>
                <input name="storeName" defaultValue={business.storeName} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none" />
              </div>

              <ImageOrUrlField
                fieldName="coverImage"
                label="Imagen de Portada (Banner)"
                initialValue={business.coverImage || ""}
                placeholder="https://images.unsplash.com/..."
              />

              <ImageOrUrlField
                fieldName="avatar"
                label="Logo (Circular)"
                initialValue={business.avatar || ""}
                placeholder="https://..."
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <MapPin size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Ubicación y Contacto</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Dirección Exacta</label>
                <input name="address" defaultValue={business.address || ""} placeholder="Calle 23 e/ L y M, Vedado" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">WhatsApp de Pedidos</label>
                <input name="phoneNumber" defaultValue={business.phoneNumber || ""} placeholder="535..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <Clock size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Horario de Operación</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Apertura</label>
                <input name="openTime" type="time" defaultValue={business.openTime || "10:00"} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Cierre</label>
                <input name="closeTime" type="time" defaultValue={business.closeTime || "23:00"} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <DollarSign size={18} />
              <h2 className="font-black uppercase text-xs tracking-widest">Tasa de Cambio</h2>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">CUP por 1 USD</label>
              <input
                name="cupExchangeRate"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                defaultValue={business.cupExchangeRate ?? ""}
                placeholder="Ej: 400"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1 ml-1">
                Cuántos CUP equivalen a 1 USD — usado para mostrar tus precios en ambas monedas.
              </p>
            </div>
          </section>

          <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={24} /> Guardar Cambios
          </button>

        </form>
      </div>
    </main>
  );
}
