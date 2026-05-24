import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function CategoriesPage() {
  // Filtramos 'all'
  const list = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-blue-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Explorar por Categorías</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                href={`/?category=${cat.id}`}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all group"
              >
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={32} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.label}</h3>
                <p className="text-xs text-center text-gray-500 px-2 line-clamp-2">
                  {cat.description || "Ver productos"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}