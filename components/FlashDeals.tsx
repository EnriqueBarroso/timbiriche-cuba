// components/FlashDeals.tsx
import { Zap } from "lucide-react";
import FlashProductCard from "./FlashProductCard";

// Datos de marketing (Estáticos por ahora)
const flashProducts = [
  {
    id: 1,
    title: "Auriculares Pro",
    price: 29.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    discount: 50,
  },
  {
    id: 2,
    title: "Smartwatch X",
    price: 49.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    discount: 50,
  },
  {
    id: 3,
    title: "Cargador Rápido",
    price: 14.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop",
    discount: 57,
  },
  {
    id: 4,
    title: "PowerBank 20k",
    price: 25.00,
    originalPrice: 50.00,
    image: "https://images.unsplash.com/photo-1609592424393-272e50c4ee80?w=200&h=200&fit=crop",
    discount: 50,
  },
];

export default function FlashDeals() {
  return (
    <section className="px-4 lg:px-8 py-6 bg-gradient-to-r from-red-50 to-white mb-6">
      
      {/* Cabecera con Contador */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-red-600">
            <Zap className="w-5 h-5 fill-red-600" />
            <span className="font-bold text-lg uppercase tracking-tight">Ofertas Flash</span>
          </div>
        </div>
        
        {/* Contador Visual */}
        <div className="flex items-center gap-1 font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
          <span className="bg-gray-900 text-white rounded px-1">02</span>
          <span>:</span>
          <span className="bg-gray-900 text-white rounded px-1">34</span>
          <span>:</span>
          <span className="bg-gray-900 text-white rounded px-1">56</span>
        </div>
      </div>
      
      {/* Grid Horizontal Deslizable */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-4 lg:mx-0 lg:px-0 lg:overflow-visible snap-x">
        {flashProducts.map((product) => (
          <FlashProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
