"use client";

import { useState } from "react";
import { Save, Utensils, DollarSign, Tag, AlignLeft, ArrowLeft, Loader2, ImagePlus, X, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createFoodProduct } from "./actions";

export default function NuevoPlatoPage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const foodCategories = ["Entrantes", "Platos Fuertes", "Pizzas", "Pastas", "Postres", "Bebidas", "Cafés"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 text-gray-900 font-black uppercase italic tracking-tighter">
          <Link href="/vender" className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl">Nuevo Plato</h1>
          <div className="w-10" />
        </div>

        <form 
          action={async (formData) => {
            setLoading(true);
            try {
              await createFoodProduct(formData);
            } catch (err) {
              alert("Error al subir el plato");
              setLoading(false);
            }
          }} 
          className="space-y-4"
        >
          {/* SECTOR DE IMAGEN (LA NOVEDAD 📸) */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Foto del Plato</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button type="button" onClick={() => setUploadMode("file")} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${uploadMode === "file" ? "bg-white shadow-sm text-red-600" : "text-gray-400"}`}>ARCHIVO</button>
                <button type="button" onClick={() => setUploadMode("url")} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${uploadMode === "url" ? "bg-white shadow-sm text-red-600" : "text-gray-400"}`}>URL</button>
              </div>
            </div>

            {uploadMode === "file" ? (
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden border-2 border-dashed border-red-100">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black"><X size={16} /></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-red-50/30 hover:border-red-200 transition-all">
                    <ImagePlus size={32} className="text-gray-300 mb-2" />
                    <span className="text-xs font-bold text-gray-400">Subir foto desde el móvil</span>
                    <input type="file" name="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            ) : (
              <div className="relative">
                <LinkIcon className="absolute left-4 top-3.5 text-gray-300" size={18} />
                <input name="imageUrl" placeholder="https://ejemplo.com/foto.jpg" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" />
              </div>
            )}
          </div>

          {/* DATOS BÁSICOS (Nombre, Precio, Categoría) */}
          <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Nombre</label>
            <div className="relative">
              <Utensils className="absolute left-4 top-3 text-red-500" size={18} />
              <input name="name" required placeholder="Ej: Pizza Serrana" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Precio</label>
              <div className="relative"><DollarSign className="absolute left-4 top-3 text-green-500" size={18} />
                <input name="price" type="number" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold outline-none" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Categoría</label>
              <div className="relative"><Tag className="absolute left-4 top-3 text-orange-500" size={18} />
                <select name="category" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold appearance-none outline-none">
                  <option value="" disabled selected>Elegir...</option>
                  {foodCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-[#D32F2F] text-white p-5 rounded-[2.5rem] font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            {loading ? "SUBIENDO..." : "AÑADIR AL MENÚ"}
          </button>
        </form>
      </div>
    </div>
  );
}