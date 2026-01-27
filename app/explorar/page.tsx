// app/explorar/page.tsx
import { ArrowLeft, TrendingUp, Star, Clock } from "lucide-react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function ExplorePage() {
  const sections = [
    { icon: TrendingUp, label: "Tendencias", color: "bg-blue-100 text-blue-700" },
    { icon: Star, label: "Mejor valorados", color: "bg-yellow-100 text-yellow-700" },
    { icon: Clock, label: "Recién llegados", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Explorar</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick filters */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.label}
                className={`flex items-center gap-2 px-5 py-3 rounded-full ${section.color} whitespace-nowrap transition-transform hover:scale-105 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-bold">{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured section */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Productos destacados</h2>
          <ProductGrid />
        </section>
      </main>
    </div>
  );
}