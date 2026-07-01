"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Store, Loader2, Info } from "lucide-react";
import { createSellerAdmin } from "@/lib/actions";

type SellerType = "store" | "wholesale" | "restaurant";

const EMPTY_FORM = {
  storeName: "",
  email: "",
  phoneNumber: "",
  description: "",
  sellerType: "store" as SellerType,
};

const TYPE_OPTIONS: { value: SellerType; label: string }[] = [
  { value: "store", label: "🏪 Tienda" },
  { value: "wholesale", label: "🏢 Mayorista" },
  { value: "restaurant", label: "🍽️ Chopin Eat (Comida)" },
];

export default function CreateSellerForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.storeName || !form.email) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createSellerAdmin({
        storeName: form.storeName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        description: form.description,
        isRestaurant: form.sellerType === "restaurant",
        isWholesale: form.sellerType === "wholesale",
      });
      toast.success(res.message);
      setForm(EMPTY_FORM);
    } catch (error: any) {
      toast.error(error.message || "Error al crear el vendedor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Store className="w-5 h-5" /> Crear Vendedor Manualmente
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de tienda</label>
          <input
            type="text"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="vendedor@ejemplo.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de vendedor</label>
          <select
            value={form.sellerType}
            onChange={(e) => setForm({ ...form, sellerType: e.target.value as SellerType })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {form.sellerType === "wholesale" && (
          <div className="sm:col-span-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>
              Este vendedor es mayorista. Los productos que le crees deben tener la categoría{" "}
              <strong>🏢 Venta Mayorista</strong> para que aparezcan en <code>/mayoristas</code>.
              No hay un campo especial en la base de datos todavía.
            </span>
          </div>
        )}

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
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Store size={18} />}
            {isLoading ? "Creando..." : "Crear Vendedor"}
          </button>
        </div>
      </form>
    </section>
  );
}
