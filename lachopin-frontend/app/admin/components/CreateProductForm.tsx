"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PackagePlus, Loader2 } from "lucide-react";
import { createProductAdmin } from "@/lib/actions";
import { CATEGORIES } from "@/lib/categories";

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

interface BusinessOption {
  id: string;
  storeName: string;
}

const EMPTY_FORM = {
  businessId: "",
  title: "",
  price: "",
  category: "",
  imageUrl: "",
  description: "",
};

export default function CreateProductForm({ businesses }: { businesses: BusinessOption[] }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  // Guard con ref (no state) para bloquear dobles envíos sin depender del
  // timing de re-render de `isLoading`.
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!form.businessId || !form.title || !form.price || !form.category || !form.imageUrl) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    const payload = {
      businessId: form.businessId,
      title: form.title,
      price: Number(form.price),
      category: form.category,
      imageUrl: form.imageUrl,
      description: form.description,
    };

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      let res;
      try {
        res = await createProductAdmin(payload);
      } catch (firstError) {
        // Reintento automático y transparente: cubre el caso conocido de
        // Next.js/Turbopack en dev donde la primera invocación de una
        // Server Action puede fallar justo tras una recompilación, y un
        // segundo intento funciona sin más. Así el usuario nunca ve un
        // fallo silencioso — si de verdad falla dos veces, sí se lo avisamos.
        console.warn("Primer intento de crear producto falló, reintentando:", firstError);
        res = await createProductAdmin(payload);
      }
      toast.success(res.message);
      setForm(EMPTY_FORM);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear el producto. Intenta de nuevo.";
      toast.error(message);
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <PackagePlus className="w-5 h-5" /> Crear Producto Manualmente
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select
            value={form.businessId}
            onChange={(e) => setForm({ ...form, businessId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecciona un vendedor</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.storeName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-gray-400">(opcional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PackagePlus size={18} />}
            {isLoading ? "Creando..." : "Crear Producto"}
          </button>
        </div>
      </form>
    </section>
  );
}
