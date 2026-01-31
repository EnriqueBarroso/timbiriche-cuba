"use client";

import { ArrowRight, ShieldCheck, Truck, CreditCard, Sparkles, Smartphone, Shirt, Home } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-12 md:pt-12 md:pb-24 lg:pt-20 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* --- Columna Izquierda: Texto y Call to Actions --- */}
          <div className="flex flex-col items-start text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Badge "Nuevo" - CORREGIDO: Ahora en tono rojo/coral */}
            <span className="mb-6 inline-flex items-center rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-700/10 mx-auto lg:mx-0">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-red-600" />
              Nuevo en Timbiriche
            </span>

            {/* Título Principal - CORREGIDO: Todo en negro, sin gradiente azul */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-[1.1]">
              Lo mejor de Cuba <br className="hidden lg:block" />
              <span className="text-gray-900">
                en un solo lugar
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="mb-8 text-lg text-gray-600 md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Descubre miles de productos de vendedores verificados. Compra y vende de forma segura con nuestra comunidad de confianza.
            </p>

            {/* Botones de Acción - CORREGIDO: Botón principal ahora es naranja */}
            <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto justify-center lg:justify-start">
              <Link href="#products" className="w-full sm:w-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:scale-105 active:scale-95">
                  Explorar productos
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              
              <Link href="/vender" className="w-full sm:w-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95">
                  Comenzar a vender
                </button>
              </Link>
            </div>
            
            {/* Badges de Confianza (Trust Signals) - CORREGIDO: Colores más suaves */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 border-t border-gray-100 pt-8 w-full">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                    <ShieldCheck className="h-4 w-4 text-red-500" />
                </div>
                <span>Vendedores verificados</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                    <Truck className="h-4 w-4 text-blue-500" />
                </div>
                <span>Envíos a toda Cuba</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                 </div>
                <span>Pago seguro</span>
              </div>
            </div>
          </div>

          {/* --- Columna Derecha: Grid Visual Moderno --- */}
          {/* Oculto en móvil para no ocupar tanto scroll vertical inicial */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8"> {/* Desplazado un poco hacia abajo para efecto asimétrico */}
                
                {/* Card 1: Tecnología - CORREGIDO: Fondo rosa claro */}
                <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-red-50 border border-red-100 shadow-sm relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 shadow-sm ring-1 ring-red-200 group-hover:scale-110 transition-transform duration-300">
                      <Smartphone className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="font-semibold text-gray-900">Tecnología</p>
                    <p className="text-xs text-gray-500 mt-1">Móviles y Laptops</p>
                  </div>
                </div>

                {/* Card 2: Moda - CORREGIDO: Fondo azul claro */}
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-blue-50 border border-blue-100 shadow-sm relative group">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 shadow-sm ring-1 ring-blue-200 group-hover:scale-110 transition-transform duration-300">
                      <Shirt className="h-7 w-7 text-blue-500" />
                    </div>
                    <p className="font-semibold text-gray-900">Moda</p>
                  </div>
                </div>

              </div>

              <div className="space-y-4">
                
                {/* Card 3: Hogar - CORREGIDO: Mantiene gris neutro */}
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-sm relative group">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200 group-hover:scale-110 transition-transform duration-300">
                       <Home className="h-7 w-7 text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-900">Hogar</p>
                  </div>
                </div>

                {/* Card 4: Varios - CORREGIDO: Fondo naranja/melocotón suave */}
                <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-orange-50 border border-orange-100 shadow-sm relative group">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center z-10">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 shadow-sm ring-1 ring-orange-200 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="font-bold text-lg text-gray-900">Y mucho más</p>
                    <p className="text-sm text-gray-600 mt-1">Explora hoy</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Elementos Decorativos de Fondo (Blobs) - CORREGIDO: Tonos más suaves */}
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-30 -z-10" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-red-100 blur-3xl opacity-30 -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
