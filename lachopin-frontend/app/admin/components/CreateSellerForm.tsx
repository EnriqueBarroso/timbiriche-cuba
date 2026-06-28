"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Store, Loader2 } from "lucide-react";
import { createSellerAdmin } from "@/lib/actions";

const EMPTY_FORM = {
  storeName: "",
  email: "",
  phoneNumber: "",
  description: "",
};

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
