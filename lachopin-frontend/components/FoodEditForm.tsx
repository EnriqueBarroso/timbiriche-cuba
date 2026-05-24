"use client";

import { useState } from "react";
import { Save, Utensils, DollarSign, Tag, AlignLeft, Loader2, ImagePlus, X, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { updateFoodProduct } from "../app/editar/[id]/actions";

export default function FoodEditForm({ product }: { product: any }) {
    const [loading, setLoading] = useState(false);
    const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

    // Obtenemos la imagen actual del producto (si existe)
    const currentImage = product.images?.[0]?.url || null;
    const [imagePreview, setImagePreview] = useState<string | null>(currentImage);

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
        <form action={async (formData) => {
            setLoading(true);
            await updateFoodProduct(formData);
        }} className="space-y-4 pb-10">

            <input type="hidden" name="id" value={product.id} />

            {/* SECCIÓN DE IMAGEN CON PREVIEW */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Imagen del Plato</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setUploadMode("file")} className={`px-3 py-1 text-[10px] font-bold rounded-lg ${uploadMode === "file" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"}`}>ARCHIVO</button>
                        <button type="button" onClick={() => setUploadMode("url")} className={`px-3 py-1 text-[10px] font-bold rounded-lg ${uploadMode === "url" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"}`}>URL</button>
                    </div>
                </div>

                {uploadMode === "file" ? (
                    <div className="relative">
                        {/* 🛡️ Validación de URL ultra-segura */}
                        {imagePreview && typeof imagePreview === 'string' && (imagePreview.startsWith('http') || imagePreview.startsWith('data:image')) ? (
                            <div className="relative h-52 w-full rounded-3xl overflow-hidden border-2 border-red-50">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized={imagePreview.startsWith('data:image')} // Mejora el rendimiento de previews locales
                                />
                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-52 w-full border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50 transition-all">
                                <ImagePlus size={32} className="text-gray-300 mb-2" />
                                <span className="text-xs font-bold text-gray-400">Click para subir nueva foto</span>
                                <input type="file" name="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-3.5 text-gray-300" size={18} />
                        <input name="imageUrl" placeholder="Pegar nueva URL de imagen..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none" />
                    </div>
                )}
            </div>

            {/* CAMPOS DE TEXTO (Nombre, Precio, Categoría) */}
            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Nombre del plato</label>
                <div className="relative">
                    <Utensils className="absolute left-4 top-3 text-red-500" size={18} />
                    <input name="name" required defaultValue={product.name || product.title} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Precio (CUP)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-3 text-green-500" size={18} />
                        <input name="price" type="number" required defaultValue={product.price} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold outline-none" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Categoría</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-3 text-orange-500" size={18} />
                        <select name="category" defaultValue={product.category} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold outline-none appearance-none">
                            {foodCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Descripción / Ingredientes</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={product.description || ""}
                            placeholder="Describe el plato, ingredientes..."
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none resize-none"
                        />
                    </div>
                </div>
            </div>

            <button disabled={loading} className="w-full bg-black text-white p-5 rounded-[2.5rem] font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                {loading ? "GUARDANDO..." : "ACTUALIZAR PLATO"}
            </button>
        </form>
    );
}