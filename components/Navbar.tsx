"use client"

import { Search, ShoppingCart, Bell, Menu, PackageOpen, Settings, Package, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import CategoriesDrawer from "@/components/CategoriesDrawer";

// 1. IMPORTAR COMPONENTES DE CLERK
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
    const { totalItems } = useCart();
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white safe-area-top border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    
                    {/* FILA PRINCIPAL (Altura fija 80px para dar aire) */}
                    <div className="h-20 flex items-center justify-between gap-4">

                        {/* BLOQUE IZQUIERDO: Menú + Logo (No se encogen) */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* 1. BOTÓN MENÚ */}
                            <button
                                onClick={() => setCategoriesOpen(true)}
                                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Abrir menú"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* 2. LOGO */}
                            <Link href="/" className="flex-shrink-0">
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
                                    Timbi<span className="text-blue-600">riche</span> 🇨🇺
                                </h1>
                                {/* Logo versión móvil */}
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight sm:hidden">
                                    Timbi<span className="text-blue-600">.</span>
                                </h1>
                            </Link>
                        </div>

                        {/* BLOQUE CENTRAL: BUSCADOR (Oculto en móvil, visible en escritorio) */}
                        {/* max-w-xl limita el ancho para que no aplaste a los demás */}
                        <div className="hidden md:flex flex-1 max-w-xl mx-auto px-4">
                            <form onSubmit={handleSearch} className="w-full relative">
                                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                                    <Search className="w-4 h-4" />
                                </button>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar..."
                                    className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-500 text-sm rounded-full py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-transparent focus:border-blue-500/20 focus:bg-white"
                                />
                            </form>
                        </div>

                        {/* BLOQUE DERECHO: ICONOS DE ACCIÓN (No se encogen) */}
                        <div className="flex items-center gap-2 flex-shrink-0">

                            {/* Campana */}
                            <button className="hidden lg:block p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Carrito */}
                            <Link
                                href="/carrito"
                                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                                {totalItems > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* --- ZONA DE USUARIO CLERK --- */}
                            <div className="flex items-center pl-2 ml-1 border-l border-gray-200">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors border border-blue-100 whitespace-nowrap">
                                            Entrar
                                        </button>
                                    </SignInButton>
                                </SignedOut>

                                <SignedIn>
                                    {/* Iconos extra visibles solo si estás logueado */}
                                    <div className="hidden sm:flex items-center mr-2 gap-1">
                                        <Link href="/favoritos" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Mis Favoritos">
                                            <Heart className="w-5 h-5" />
                                        </Link>
                                        <Link href="/mis-publicaciones" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all" title="Mis Publicaciones">
                                            <Package className="w-5 h-5" />
                                        </Link>
                                        <Link href="/perfil" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all" title="Configurar">
                                            <Settings className="w-5 h-5" />
                                        </Link>
                                    </div>

                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-9 h-9 border-2 border-white shadow-sm"
                                            }
                                        }}
                                    >
                                        <UserButton.MenuItems>
                                            <UserButton.Link
                                                label="Mis Publicaciones"
                                                labelIcon={<PackageOpen className="w-4 h-4" />}
                                                href="/mis-publicaciones"
                                            />
                                            <UserButton.Action label="manageAccount" />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </SignedIn>
                            </div>
                        </div>
                    </div>

                    {/* BUSCADOR MÓVIL (Solo visible en pantallas pequeñas, debajo de la fila principal) */}
                    <div className="md:hidden pb-3">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search className="w-4 h-4" />
                            </button>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar en Timbiriche..."
                                className="w-full bg-gray-100 text-gray-900 text-sm rounded-full py-2.5 pl-9 pr-4 outline-none focus:bg-white border border-transparent focus:border-gray-200"
                            />
                        </form>
                    </div>

                </div>
            </header>

            {/* Drawer Lateral */}
            <CategoriesDrawer open={categoriesOpen} onOpenChange={setCategoriesOpen} />
        </>
    );
};