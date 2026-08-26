"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/lib/actions";
import MultiImageUpload from "../MultiImageUpload";

const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

// Mismas categorías ya usadas en el flujo de publicación existente
// (app/vender/VenderForm.tsx), para no introducir una taxonomía nueva.
const CATEGORY_OPTIONS = [
  { value: "cellphones", label: "📱 Celulares y Tablets" },
  { value: "vehicles", label: "🚗 Motos, Carros y Bicicletas" },
  { value: "fashion", label: "👗 Ropa y Calzado" },
  { value: "appliances", label: "📺 Electrodomésticos" },
  { value: "home", label: "🛋️ Hogar y Muebles" },
  { value: "food", label: "🍗 Combos y Alimentos" },
  { value: "parts", label: "🔧 Piezas y Accesorios" },
  { value: "crafts", label: "🎨 Artesanía y Manufactura" },
  { value: "others", label: "📦 Otros" },
  { value: "wholesale", label: "🏢 Venta Mayorista (B2B)" },
];

interface Props {
  slug: string;
}

export default function NewProductForm({ slug }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Guard con ref (no state) para bloquear dobles envíos sin depender del
  // timing de re-render de `isLoading`.
  const isSubmittingRef = useRef(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    images: [] as string[],
  });

  const inputStyles =
    "w-full rounded-2xl border border-black/10 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (formData.images.length === 0) {
      return toast.error("Sube al menos una foto del producto");
    }

    const payload = {
      title: formData.title,
      price: Number(formData.price),
      currency: "USD",
      category: formData.category,
      description: formData.description,
      images: formData.images,
      isFlashOffer: false,
    };

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      try {
        await createProduct(payload);
      } catch (firstError) {
        // Reintento automático y transparente: cubre el caso conocido de
        // Next.js/Turbopack en dev donde la primera invocación de una
        // Server Action puede fallar justo tras una recompilación, y un
        // segundo intento funciona sin más. Así el usuario nunca ve un
        // fallo silencioso — si de verdad falla dos veces, sí se lo avisamos.
        console.warn("Primer intento de publicar falló, reintentando:", firstError);
        await createProduct(payload);
      }
      toast.success("¡Producto publicado!");
      router.push(`/vendedor/${slug}/productos`);
      router.refresh();
    } catch (error) {
      console.error("Error al crear producto:", error);
      toast.error("No se pudo publicar el producto. Intenta de nuevo.");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center font-sans" style={{ backgroundColor: CREAM }}>
      <div className="w-full max-w-md relative pb-10" style={{ backgroundColor: CREAM }}>
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <Link
            href={`/vendedor/${slug}/productos`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-black/10 text-gray-600 shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-black text-gray-900">Nuevo producto</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-5 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fotos *</label>
            <MultiImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre</label>
            <input
              required
              type="text"
              placeholder="Ej. Ropa Vieja con Congrí"
              className={inputStyles}
              style={{ outlineColor: TERRACOTTA }}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Precio (USD)</label>
            <input
              required
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className={inputStyles}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoría</label>
            <select
              required
              className={inputStyles}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="" disabled>
                Selecciona una categoría...
              </option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
            <textarea
              required
              rows={4}
              placeholder="Cuéntale a tus clientes de qué se trata..."
              className={inputStyles}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-black text-base shadow-lg active:scale-[0.98] transition-all hover:brightness-105 disabled:opacity-60"
            style={{ backgroundColor: TERRACOTTA }}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isLoading ? "Publicando..." : "Publicar producto"}
          </button>
        </form>
      </div>
    </main>
  );
}
