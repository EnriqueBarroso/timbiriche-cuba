// components/MobileMenu.tsx
"use client"

import { Menu, Home, Package, Truck, Info, Phone, User, Heart, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"

export default function MobileMenu() {
  return (
    <Sheet>
      {/* Botón Hamburguesa Mejorado */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100 rounded-full">
          <Menu className="h-6 w-6 text-gray-800" />
        </Button>
      </SheetTrigger>

      {/* El Panel Lateral */}
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-gray-50 border-r-gray-200">
        
        {/* 1. CABECERA DE PERFIL (Estilo App) */}
        <SheetHeader className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500 font-medium">Bienvenido,</p>
              <h3 className="text-gray-900 font-bold text-lg leading-none">Invitado</h3>
            </div>
          </div>
          <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 shadow-sm shadow-blue-200">
            Iniciar Sesión / Registrarse
          </Button>
        </SheetHeader>
        
        {/* 2. CUERPO DEL MENÚ (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Explorar</p>
          
          <MenuItem href="/" icon={<Home className="w-5 h-5 text-gray-500" />} label="Inicio" />
          <MenuItem href="/ofertas" icon={<Heart className="w-5 h-5 text-red-500" />} label="Ofertas Flash" />
          <MenuItem href="/categorias" icon={<Package className="w-5 h-5 text-blue-500" />} label="Todas las Categorías" />
          
          <div className="my-4 border-t border-gray-200/50 mx-4" /> {/* Separador sutil */}
          
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Servicios</p>
          
          <MenuItem href="/envios" icon={<Truck className="w-5 h-5 text-green-600" />} label="Envíos a Cuba" />
          <MenuItem href="/vender" icon={<StoreIcon className="w-5 h-5 text-purple-600" />} label="Vender Producto" />
        </div>

        {/* 3. FOOTER FIJO (Ayuda) */}
        <SheetFooter className="bg-white p-4 border-t border-gray-100">
          <Link href="/ayuda" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-full border border-gray-100 hover:bg-gray-100 transition-colors">
             <div className="bg-white p-2 rounded-full shadow-sm">
                <Phone className="w-4 h-4 text-gray-700" />
             </div>
             <div>
               <p className="text-xs text-gray-500 font-medium">Soporte 24/7</p>
               <p className="text-sm font-bold text-gray-900">Contáctanos</p>
             </div>
          </Link>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  )
}

// Sub-componente para limpiar el código repetitivo
function MenuItem({ href, icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-[0.98]">
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function StoreIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
  )
}
