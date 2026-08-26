import Link from "next/link";
import { ShoppingBag, Home } from "lucide-react";

const TERRACOTTA = "#B84C24";
const CREAM = "#FBF3EA";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div
            className="text-white p-1.5 rounded-lg"
            style={{ backgroundColor: TERRACOTTA }}
          >
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            La<span style={{ color: TERRACOTTA }}>Chopin</span>
          </span>
        </Link>

        <p
          className="text-7xl font-black mb-4"
          style={{ color: TERRACOTTA }}
        >
          404
        </p>

        <h1 className="text-2xl font-black text-gray-900 mb-3">
          Esta página no existe
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Puede que el enlace esté roto o que la página se haya movido.
          Vuelve al inicio para seguir explorando negocios y productos.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg active:scale-95 transition-all hover:brightness-105"
          style={{ backgroundColor: TERRACOTTA }}
        >
          <Home size={18} /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}
