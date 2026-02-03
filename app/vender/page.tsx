"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MultiImageUpload } from "@/components/MultiImageUpload"; // Asegúrate de tener este componente
import { createProduct } from "@/lib/actions"; // Asegúrate de tener esta acción en lib/actions
import { Loader2, DollarSign, Store, TrendingUp } from "lucide-react";

export default function VenderPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    currency: "USD",
    category: "food",
    description: "",
    images: [] as string[],
  });

  // Redirección si no hay usuario (Protección básica)
  if (isLoaded && !isSignedIn) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0)
      return alert("¡Debes subir al menos 1 foto!");

    try {
      setIsLoading(true);

      // Llamamos a la Server Action
      await createProduct({
        title: formData.title,
        price: Number(formData.price),
        currency: formData.currency,
        category: formData.category,
        description: formData.description,
        images: formData.images,
      });

      router.push("/"); // Volver al inicio tras éxito
    } catch (error) {
      console.error(error);
      alert("Error al publicar. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* --- ENCABEZADO (Manteniendo tu estilo original) --- */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
              Panel de Vendedor
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Impulsa tu <span className="text-blue-600">Negocio</span>
          </h1>
          <p className="mt-3 text-base text-gray-500">
            Publica tus productos en el Timbiriche Digital. Ideal para llegar a
            más clientes en toda Cuba.
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Mayor visibilidad</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Contacto directo WhatsApp</span>
            </div>
          </div>
        </div>

        {/* --- FORMULARIO CON LÓGICA (Nuevo) --- */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100"
        >
          {/* 1. Subida de Imagen */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Fotos del Producto <span className="text-red-500">*</span>
            </label>
            <MultiImageUpload
              values={formData.images}
              onUpload={(urls) => setFormData({ ...formData, images: urls })}
              maxImages={5}
            />
          </div>

          {/* 2. Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Producto
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Samsung S23 Ultra - Nuevo en caja"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all outline-none border"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* 3. Precio y Moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <DollarSign size={16} />
                </div>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all outline-none border"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all outline-none border"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CUP">CUP</option>
                <option value="MLC">MLC</option>
              </select>
            </div>
          </div>

          {/* 4. Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all outline-none border"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {/* Opción por defecto */}
              <option value="" disabled>
                Selecciona una categoría
              </option>

              {/* --- LAS 6 IMPRESCINDIBLES --- */}
              <option value="food">🍗 Combos y Alimentos</option>
              <option value="parts">🔧 Piezas y Accesorios</option>
              <option value="home">🛋️ Hogar y Decoración</option>
              <option value="logistics">🛵 Logística y Mensajería</option>
              <option value="tech">📱 Tecnología (Celulares/Laptops)</option>
              <option value="fashion">👗 Ropa y Moda</option>
            </select>
          </div>

          {/* 5. Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              rows={4}
              placeholder="Detalles importantes (estado, entrega, etc.)"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all outline-none resize-none border"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Botón de Acción */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Publicando...
              </>
            ) : (
              "Publicar Anuncio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
