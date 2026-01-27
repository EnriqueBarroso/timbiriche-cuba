// components/SellForm.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, DollarSign, Tag, FileText, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CldUploadWidget } from 'next-cloudinary';

export default function SellForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        description: "",
        category: "electronica", // Valor por defecto importante
        imageUrl: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. VALIDACIONES VISUALES
        if (!formData.imageUrl) {
            toast.error("📸 Falta la foto del producto");
            return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error("💰 El precio debe ser un número válido");
            return;
        }
        if (!formData.title.trim()) {
            toast.error("📝 Escribe un título para tu producto");
            return;
        }

        setIsSubmitting(true);

        try {
            // 2. LIMPIEZA DE DATOS (Para evitar Error 400)
            const cleanPrice = formData.price.replace(",", "."); // Cambiar comas por puntos

            const payload = {
                title: formData.title,
                description: formData.description,
                price: cleanPrice,
                category: formData.category,
                imageUrl: formData.imageUrl
            };

            console.log("Enviando:", payload); // Para depurar si hace falta

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // Leer respuesta, sea buena o mala
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al conectar con el servidor");
            }

            toast.success("¡Producto publicado correctamente!");
            router.push(`/product/${data.id}`);

        } catch (error) {
            console.error(error);

            const errorMessage = error instanceof Error ? error.message : "Hubo un problema al publicar";

            toast.error(errorMessage);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">

            {/* Título */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nombre del Producto</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                        required
                        name="title"
                        placeholder="Ej: Zapatillas Adidas Talla 42"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        onChange={handleChange}
                        value={formData.title}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Precio */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Precio (USD)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            required
                            type="number"
                            name="price"
                            placeholder="0"
                            step="0.01" // Permite decimales
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                            onChange={handleChange}
                            value={formData.price}
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Categoría</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <select
                            name="category"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-gray-900 bg-white"
                            onChange={handleChange}
                            value={formData.category}
                        >
                            <option value="electronica">Electrónica</option>
                            <option value="moda">Moda</option>
                            <option value="hogar">Hogar</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="vehiculos">Vehículos</option>
                            <option value="salud">Salud</option>
                            <option value="bebes">Bebés</option>
                            <option value="deportes">Deportes</option>
                            <option value="servicios">Servicios</option>
                            <option value="libros">Libros</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* WIDGET DE IMAGEN */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Foto Principal</label>

                {formData.imageUrl ? (
                    // Vista Previa
                    <div className="relative w-full h-56 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                        <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    // Botón Cloudinary
                    <CldUploadWidget
                        uploadPreset="timbiriche_preset"
                        onSuccess={(result: unknown) => {
                            // Le decimos a TS: "Confía en mí, esto tiene una propiedad info con una url"
                            const data = result as { info: { secure_url: string } };

                            setFormData({ ...formData, imageUrl: data.info.secure_url });

                            document.body.style.overflow = "auto";
                            document.body.style.paddingRight = "0px";
                        }}

                        onQueuesEnd={() => {
                            document.body.style.overflow = "auto";
                        }}
                        options={{
                            maxFiles: 1,
                            resourceType: "image",
                            clientAllowedFormats: ["jpg", "png", "webp"],
                            sources: ["local", "camera", "url"],
                            folder: "timbiriche_products",
                            language: "es",
                            text: {
                                es: {
                                    menu: { files: "Mis Archivos" },
                                    local: { browse: "Explorar", dd_title_single: "Arrastra tu foto aquí" }
                                }
                            }
                        }}
                    >
                        {({ open }) => {
                            return (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer bg-gray-50/50"
                                >
                                    <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm font-bold block">Sube una foto</span>
                                        <span className="text-xs text-gray-400">JPG, PNG o WebP</span>
                                    </div>
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Descripción</label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe tu producto: estado, características, entrega..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                    onChange={handleChange}
                    value={formData.description}
                />
            </div>

            {/* Botón Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Publicando...
                    </>
                ) : (
                    <>
                        <Upload className="w-5 h-5" /> Publicar Ahora
                    </>
                )}
            </button>

        </form>
    );
}