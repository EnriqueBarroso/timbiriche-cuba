import Link from "next/link";
import Image from "next/image";
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
                className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute top-3 left-3 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                  <Icon size={20} />
                </div>

                <div className="relative z-10 p-4 text-center">
                  <h3 className="font-bold text-white text-lg mb-1 drop-shadow">{cat.label}</h3>
                  <p className="text-xs text-center text-white/80 px-2 line-clamp-2">
                    {cat.description || "Ver productos"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
