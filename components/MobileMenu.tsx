"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, HelpCircle, FileText, ChevronRight, LayoutGrid, Zap, Truck, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { useUser, SignedOut, SignInButton } from "@clerk/nextjs";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, isSignedIn } = useUser();

  const categoriesList = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full lg:hidden transition-colors">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      
      {/* Quitamos el padding por defecto (p-0) para que la cabecera toque los bordes */}
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r-0 flex flex-col bg-gray-50/50">
        
        {/* 1. CABECERA CON GRADIENTE */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 pb-8 text-white">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-black text-white flex items-center gap-2">
              Timbi<span className="text-blue-200">riche</span>
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              {isSignedIn && user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.imageUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="text-blue-100" size={24} />
              )}
            </div>
            <div>
               {isSignedIn ? (
                 <>
                   <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Hola de nuevo</p>
                   <p className="font-bold text-lg leading-tight truncate max-w-[180px]">
                     {user?.firstName || "Usuario"}
                   </p>
                 </>
               ) : (
                 <SignedOut>
                    <p className="text-blue-100 text-xs font-medium mb-1">Bienvenido a Timbiriche</p>
                    <SignInButton mode="modal">
                      <button onClick={() => setOpen(false)} className="flex items-center gap-2 bg-white text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                        <LogIn size={14} /> Iniciar Sesión
                      </button>
                    </SignInButton>
                 </SignedOut>
               )}
            </div>
          </div>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* SECCIÓN 1: ACCIONES RÁPIDAS */}
          <div className="space-y-3">
            {/* OFERTAS FLASH (Estilo Vibrante) */}
            <Link
                href="/ofertas"
                onClick={() => setOpen(false)}
                className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20 group hover:scale-[1.02] transition-transform"
            >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                        <Zap size={20} className="text-yellow-300 fill-yellow-300" />
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-none">Ofertas Flash</p>
                        <p className="text-orange-100 text-xs mt-1 font-medium">¡Descuentos hoy!</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-white/70 relative z-10" />
            </Link>

            {/* ENVÍOS A CUBA */}
            <Link
                href="/envios"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-blue-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Truck size={20} />
                    </div>
                    <span className="font-bold text-gray-800">Envíos a Cuba</span>
                </div>
            </Link>
          </div>

          {/* SECCIÓN 2: CATEGORÍAS */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
              <LayoutGrid size={12} /> Categorías
            </h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <Link
                href="/categorias"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <span className="font-medium text-gray-700 text-sm">Ver todas las categorías</span>
                <ChevronRight size={16} className="text-gray-300" />
              </Link>

              {categoriesList.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        {cat.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 3: LEGAL */}
          <div className="pb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
              <Link
                href="/ayuda"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HelpCircle size={18} className="text-gray-400" />
                <span className="text-sm font-medium">Ayuda y Soporte</span>
              </Link>
              <Link
                href="/terminos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FileText size={18} className="text-gray-400" />
                <span className="text-sm font-medium">Términos y Condiciones</span>
              </Link>
            </div>
            
            <p className="text-center text-[10px] text-gray-400 mt-6">
              © 2024 Timbiriche Cuba v1.0
            </p>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}