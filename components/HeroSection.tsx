"use client";

import { ArrowRight, ShieldCheck, Truck, CreditCard, Sparkles, Smartphone, Shirt, Home } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-8 md:pt-12 md:pb-24 lg:pt-20 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* --- Columna Izquierda --- */}
          <div className="flex flex-col items-start text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="mb-4 md:mb-6 inline-flex items-center rounded-full bg-red-50 px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium text-red-700 ring-1 ring-inset ring-red-700/10 mx-auto lg:mx-0">
              <Sparkles className="mr-1 md:mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5 text-red-600" />
              Nuevo en Timbiriche
            </span>

            <h1 className="mb-3 md:mb-6 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Lo mejor de Cuba <br className="hidden sm:block" />
              en un solo lugar
            </h1>

            <p className="mb-6 md:mb-8 text-base md:text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Miles de productos de vendedores verificados. 
              <span className="hidden md:inline"> Compra y vende de forma segura con nuestra comunidad de confianza.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start mb-6 md:mb-0">
              <Link href="/?category=all" className="w-full sm:w-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:scale-105 active:scale-95">
                  Explorar productos
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </Link>
              
              <Link href="/vender" className="w-full sm:w-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 active:bg-blue-100 active:border-blue-600 active:shadow-inner">
                  Comenzar a vender
                </button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4 border-t border-gray-100 pt-6 md:pt-8 w-full md:mt-10">
              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-gray-600">
                <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-red-50">
                  <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-500" />
                </div>
                <span className="hidden sm:inline">Vendedores verificados</span>
                <span className="sm:hidden">Verificado</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-gray-600">
                <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-blue-50">
                  <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500" />
                </div>
                <span className="hidden sm:inline">Envíos a toda Cuba</span>
                <span className="sm:hidden">Envíos</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-gray-600">
                <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-orange-50">
                  <CreditCard className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-500" />
                </div>
                <span className="hidden sm:inline">Pago seguro</span>
                <span className="sm:hidden">Seguro</span>
              </div>
            </div>
          </div>

          {/* --- Columna Derecha: Grid Visual Sincronizado --- */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                
                {/* Card 1: Tecnología (tech) */}
                <Link href="/?category=tech" className="block aspect-[4/5] overflow-hidden rounded-3xl bg-red-50 border border-red-100 shadow-sm relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 shadow-sm ring-1 ring-red-200 group-hover:scale-110 transition-transform duration-300">
                      <Smartphone className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="font-semibold text-gray-900">Tecnología</p>
                    <p className="text-xs text-gray-500 mt-1">Móviles y Laptops</p>
                  </div>
                </Link>

                {/* Card 2: Moda (fashion) */}
                <Link href="/?category=fashion" className="block aspect-[4/3] overflow-hidden rounded-3xl bg-blue-50 border border-blue-100 shadow-sm relative group">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 shadow-sm ring-1 ring-blue-200 group-hover:scale-110 transition-transform duration-300">
                      <Shirt className="h-7 w-7 text-blue-500" />
                    </div>
                    <p className="font-semibold text-gray-900">Moda</p>
                  </div>
                </Link>

              </div>

              <div className="space-y-4">
                
                {/* Card 3: Hogar (home) */}
                <Link href="/?category=home" className="block aspect-[4/3] overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-sm relative group">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200 group-hover:scale-110 transition-transform duration-300">
                      <Home className="h-7 w-7 text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-900">Hogar</p>
                  </div>
                </Link>

                {/* Card 4: Varios */}
                <Link href="/?category=all" className="block aspect-[4/5] overflow-hidden rounded-3xl bg-orange-50 border border-orange-100 shadow-sm relative group">
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center z-10">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 shadow-sm ring-1 ring-orange-200 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="font-bold text-lg text-gray-900">Y mucho más</p>
                    <p className="text-sm text-gray-600 mt-1">Explora hoy</p>
                  </div>
                </Link>

              </div>
            </div>

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-30 -z-10" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-red-100 blur-3xl opacity-30 -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}