"use client";

import { useState } from "react";
import {
    Search, Plus, Edit2, Power, PowerOff,
    Utensils, Beer, Pizza, IceCream, ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toggleProductAvailability } from "./actions";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
}

export default function InventoryManager({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Todos");

    // 1. Categorías únicas
    const categories = ["Todos", ...Array.from(new Set(initialProducts.map(p => p.category || "General")))];

    // 2. Filtrado robusto
    const filteredProducts = products.filter(p => {
        const safeName = p.name ?? "Sin nombre";
        const matchesSearch = safeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "Todos" || (p.category || "General") === activeTab;
        return matchesSearch && matchesTab;
    });

    // 3. Lógica de Iconos y Colores dinámicos
    const getCategoryStyle = (category: string) => {
        const cat = category?.toLowerCase() || "";

        // 1. BEBIDAS Y LÍQUIDOS (Azul/Cian)
        if (
            cat.includes("bebida") || cat.includes("refresco") || cat.includes("jugo") ||
            cat.includes("cerveza") || cat.includes("coctel") || cat.includes("ron") ||
            cat.includes("vino") || cat.includes("café") || cat.includes("infusion") ||
            cat.includes("liquido") || cat.includes("batido")
        ) {
            return { bgColor: "bg-cyan-50", textColor: "text-cyan-500", border: "border-cyan-100", Icon: Beer };
        }

        // 2. COMIDA RÁPIDA Y HARINAS (Naranja)
        if (
            cat.includes("pizza") || cat.includes("burguer") || cat.includes("hamburguesa") ||
            cat.includes("pan") || cat.includes("sandwich") || cat.includes("pasta") ||
            cat.includes("espagueti") || cat.includes("lasaña") || cat.includes("picadera")
        ) {
            return { bgColor: "bg-orange-50", textColor: "text-orange-500", border: "border-orange-100", Icon: Pizza };
        }

        // 3. PLATOS FUERTES Y CARNES (Rojo/Coral)
        if (
            cat.includes("fuerte") || cat.includes("comida") || cat.includes("carne") ||
            cat.includes("pollo") || cat.includes("cerdo") || cat.includes("res") ||
            cat.includes("pescado") || cat.includes("marisco") || cat.includes("entrante") ||
            cat.includes("tapa") || cat.includes("racion")
        ) {
            return { bgColor: "bg-red-50", textColor: "text-red-500", border: "border-red-100", Icon: Utensils };
        }

        // 4. DULCES Y POSTRES (Rosa)
        if (
            cat.includes("postre") || cat.includes("dulce") || cat.includes("helado") ||
            cat.includes("cake") || cat.includes("torta") || cat.includes("fruta")
        ) {
            return { bgColor: "bg-pink-50", textColor: "text-pink-500", border: "border-pink-100", Icon: IceCream };
        }

        // 5. ENSALADAS Y VEGETALES (Verde)
        if (cat.includes("ensalada") || cat.includes("vegetal") || cat.includes("guarnicion") || cat.includes("vianda")) {
            return { bgColor: "bg-green-50", textColor: "text-green-600", border: "border-green-100", Icon: Utensils };
        }

        // DEFAULT (Si nada coincide, al menos que tenga un color profesional)
        return { bgColor: "bg-blue-50", textColor: "text-blue-400", border: "border-blue-100", Icon: Utensils };
    };

    const handleToggle = async (productId: string, isCurrentlyAvailable: boolean) => {
        // El "futuro" estado: si ahora es true, queremos que sea false.
        const nextState = !isCurrentlyAvailable;

        // 1. Cambio visual instantáneo (Optimistic UI)
        setProducts(current =>
            current.map(p => p.id === productId ? { ...p, isAvailable: nextState } : p)
        );

        // 2. Llamada al servidor
        const result = await toggleProductAvailability(productId, nextState);

        // 3. Si el servidor falla (Error 500), revertimos el cambio visual
        if (result?.error) {
            setProducts(current =>
                current.map(p => p.id === productId ? { ...p, isAvailable: isCurrentlyAvailable } : p)
            );
            alert("No se pudo actualizar. Revisa la conexión con la base de datos.");
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">

            {/* HEADER DINÁMICO */}
            <div className="bg-white border-b sticky top-0 z-30 p-4 shadow-sm">
                <div className="max-w-5xl mx-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Inventario</h1>
                        <Link href="/vender" className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                            <Plus size={20} strokeWidth={3} />
                        </Link>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar plato o bebida..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeTab === cat
                                    ? "bg-black text-white shadow-lg scale-95"
                                    : "bg-white text-gray-400 border border-gray-100"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="max-w-5xl mx-auto p-4">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => {
                            const style = getCategoryStyle(product.category);
                            const Icon = style.Icon;

                            return (
                                <div
                                    key={product.id}
                                    className={`flex items-center gap-4 p-4 transition-colors ${index !== filteredProducts.length - 1 ? "border-b border-gray-50" : ""
                                        }`}
                                >
                                    {/* Miniatura Inteligente */}
                                    <div className={`relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border flex items-center justify-center transition-all ${!product.isAvailable ? "grayscale opacity-30 bg-gray-100" : style.bgColor + " " + style.border
                                        }`}>
                                        {product.image && product.image.startsWith('http') ? (
                                            <Image
                                                src={product.image}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="56px"
                                            />
                                        ) : (
                                            <Icon className={style.textColor} size={24} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold text-gray-900 truncate text-sm ${!product.isAvailable ? "text-gray-400 line-through" : ""}`}>
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-blue-600 font-black text-sm ${!product.isAvailable ? "text-gray-300" : ""}`}>
                                                ${product.price}
                                            </span>
                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">• {product.category}</span>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleToggle(product.id, product.isAvailable)}
                                            className={`p-2.5 rounded-xl transition-all ${product.isAvailable
                                                ? "text-green-600 bg-green-50 border border-green-100"
                                                : "text-red-600 bg-red-50 border border-red-100"
                                                }`}
                                        >
                                            {product.isAvailable ? <Power size={18} /> : <PowerOff size={18} />}
                                        </button>
                                        <Link
                                            href={`/editar/${product.id}`}
                                            className="p-2.5 text-gray-400 bg-gray-50 rounded-xl hover:text-blue-600 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-20 text-center">
                            <Utensils className="mx-auto text-gray-200 mb-2 opacity-20" size={48} />
                            <p className="text-gray-400 font-bold text-sm">No hay platos aquí</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}