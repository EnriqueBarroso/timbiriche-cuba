"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import { createProduct, updateProduct } from "@/lib/actions";
import { Loader2, DollarSign, Store, Save, Zap } from "lucide-react";
import { toast } from "sonner";


interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProduct?: any;
}

export default function VenderForm({ initialProduct }: Props) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Detectamos si estamos editando
  const isEditing = !!initialProduct;

  const [formData, setFormData] = useState({
    title: initialProduct?.title || "",
    // ✅ CORREGIDO: Sin divisiones complejas
    price: initialProduct?.price ? initialProduct.price.toString() : "",
    currency: initialProduct?.currency || "USD",
    category: initialProduct?.category || "",
    description: initialProduct?.description || "",
    isFlashOffer: false,
    // Mapeamos las imágenes si existen
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: initialProduct?.images ? initialProduct.images.map((img: any) => img.url) : [] as string[],
  });

  if (isLoaded && !isSignedIn) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      return toast.error("¡Sube al menos 1 foto!");
    }

    try {
      setIsLoading(true);

      if (isEditing) {
        // --- MODO EDICIÓN ---
        // ✅ CORREGIDO: Sin multiplicar por 100
        await updateProduct(initialProduct.id, {
          ...formData,
          price: Number(formData.price)
        });
        toast.success("Producto actualizado correctamente");
        router.push("/mis-publicaciones");

      } else {
        // --- MODO CREACIÓN ---
        // Validación de perfil
        const profileRes = await fetch('/perfil/check', { cache: 'no-store' });
        if (!profileRes.ok) throw new Error("Error perfil");
        const profile = await profileRes.json();
        const cleanPhone = profile.phoneNumber?.replace(/\D/g, '') || '';

        if (cleanPhone.length < 8) {
          toast.error("WhatsApp requerido");
          router.push("/perfil?returnTo=/vender");
          return;
        }

        // ✅ CORREGIDO: Sin multiplicar por 100
        await createProduct({
          title: formData.title,
          price: Number(formData.price),
          currency: formData.currency,
          category: formData.category,
          description: formData.description,
          images: formData.images,
          isFlashOffer: formData.isFlashOffer || false,
        });
        toast.success("¡Producto publicado!");
        router.push("/");
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error(isEditing ? "Error al actualizar" : "Error al publicar");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all";

  const handleMagicPaste = () => {
    navigator.clipboard.readText().then((text) => {
      if (!text) return toast.error("El portapapeles está vacío");

      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length === 0) return;

      // Título: Primera línea
      const extractedTitle = lines[0].substring(0, 80);

      // Precio: Buscamos patrones como "1200 USD", "$500", "500.00"
      const priceMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:USD|\$|CUP|MLC|EUR)/i)
        || text.match(/(?:USD|\$|CUP|MLC|EUR)\s*(\d+(?:\.\d+)?)/i);

      const extractedPrice = priceMatch ? priceMatch[1] : "";

      setFormData(prev => ({
        ...prev,
        title: extractedTitle,
        price: extractedPrice,
        description: text // Ponemos todo el texto en la descripción
      }));

      toast.success("¡Anuncio importado mágicamente! ✨");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-32">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-blue-600 uppercase">
              {isEditing ? "Editar Publicación" : "Panel de Vendedor"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? "Edita tu " : "Impulsa tu "}
            <span className="text-blue-600">{isEditing ? "Producto" : "Negocio"}</span>
          </h1>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-blue-900">¿Tienes el anuncio en otro sitio?</h4>
              <p className="text-xs text-blue-700">Copia el texto de Revolico o Facebook y dale al botón.</p>
            </div>
            <button
              type="button"
              onClick={handleMagicPaste}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Zap size={14} className="fill-white" />
              Rellenado Mágico
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          {/* 1. Fotos */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Fotos del Producto *</label>
            <MultiImageUpload
              values={formData.images}
              onUpload={(urls) => setFormData({ ...formData, images: urls })}
              maxImages={5}
            />
          </div>

          {/* 2. Título */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
            <input
              required
              type="text"
              className={inputStyles}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* 3. Precio y Moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Precio</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                  <DollarSign size={16} />
                </div>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputStyles} pl-9`}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              {/* 👇 TEXTO DE AYUDA AÑADIDO AQUÍ 👇 */}
              <p className="mt-1.5 text-[11px] leading-tight text-gray-500">
                💡 <span className="font-bold text-blue-600">Tip:</span> Si tienes varios precios, pon <span className="font-bold text-gray-900">0</span>.
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Moneda</label>
              <select
                className={inputStyles}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CUP">CUP</option>
                <option value="MLC">MLC</option>
              </select>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
            <select
              required
              className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="" disabled>Selecciona una categoría...</option>
              <option value="cellphones">📱 Celulares y Tablets</option>
              <option value="vehicles">🚗 Motos, Carros y Bicicletas</option>
              <option value="fashion">👗 Ropa y Calzado</option>
              <option value="appliances">📺 Electrodomésticos</option>
              <option value="home">🛋️ Hogar y Muebles</option>
              <option value="food">🍗 Combos y Alimentos</option>
              <option value="parts">🔧 Piezas y Accesorios</option>
              <option value="crafts">🎨 Artesanía y Manufactura</option>
              <option value="others">📦 Otros</option>
              {/* 👇 LA NUEVA LÍNEA DE NEGOCIO B2B */}
              <option value="wholesale" className="font-bold text-blue-600 bg-blue-50">🏢 Venta Mayorista (B2B)</option>
            </select>
          </div>

          {/* Oferta Flash (Controlada por el vendedor) */}
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <input
              type="checkbox"
              id="isFlashOffer"
              checked={formData.isFlashOffer || false}
              onChange={(e) => setFormData({ ...formData, isFlashOffer: e.target.checked })}
              className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
            />
            <div>
              <label htmlFor="isFlashOffer" className="font-bold text-amber-900 cursor-pointer flex items-center gap-1">
                ⚡ Poner en Oferta Flash
              </label>
              <p className="text-xs text-amber-700 mt-0.5">
                Destaca tu producto con una etiqueta especial de rebaja.
              </p>
            </div>
          </div>

          {/* 5. Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={4}
              className={inputStyles}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isLoading ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Publicar Ahora")}
          </button>
        </form>
      </div>
    </div>
  );
}