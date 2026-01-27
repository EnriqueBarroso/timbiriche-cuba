import { MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton"; 

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export default function ProductCard({ product }: Props) {
  const cleanPhone = product.seller?.phoneNumber?.replace(/\D/g, '') || '';
  const hasPhone = cleanPhone.length > 0;

  return (
    <div className="group block h-full relative">
      
      {/* CAMBIOS DE DISEÑO AQUI:
         1. border-gray-200: Borde un poco más oscuro para separar del fondo.
         2. shadow-md: Sombra base más fuerte para que "flote".
         3. hover:shadow-xl: Al pasar el ratón se levanta mucho más.
      */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-gray-200">
        
        {/* Imagen */}
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden group">
          <Link href={`/product/${product.id}`}>
            {product.images[0] ? (
              <img 
                src={product.images[0].url} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">Sin foto</div>
            )}
          </Link>

          {/* PRECIO: Rojo Cubano Intenso 🔴 */}
          <div className="absolute bottom-2 left-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg pointer-events-none">
            ${(product.price / 100).toFixed(2)}
          </div>

          {/* Botón Favorito */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton 
              productId={product.id} 
              initialIsFavorite={product.isFavorite} 
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Tienda del vendedor (Pequeño enlace arriba) */}
          {product.seller && (
            <Link 
              href={`/vendedor/${product.seller.id}`}
              className="text-[10px] uppercase tracking-wider text-blue-800 font-bold hover:underline mb-1 opacity-60"
              onClick={(e) => e.stopPropagation()}
            >
              {product.seller.storeName}
            </Link>
          )}

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-gray-900 line-clamp-2 text-base mb-1 leading-tight hover:text-red-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
             <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
               <MapPin className="w-3 h-3 text-red-400" />
               <span>Habana</span>
             </div>
             
             {hasPhone && (
               <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors shadow-sm">
                 <MessageCircle className="w-4 h-4" />
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}