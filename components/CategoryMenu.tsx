// components/CategoryMenu.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

// Datos de ejemplo para el menú
const categories = [
  {
    title: "Comida y Bebida",
    href: "/categoria/comida",
    description: "Cakes, carnes, combos y todo para la familia.",
  },
  {
    title: "Electrodomésticos",
    href: "/categoria/electro",
    description: "Splits, freezers, ventiladores y más.",
  },
  {
    title: "Aseo Personal",
    href: "/categoria/aseo",
    description: "Jabones, champú y productos de higiene.",
  },
  {
    title: "Envíos Aéreos",
    href: "/envios",
    description: "Servicio de paquetería rápida a toda la isla.",
  },
]

export default function CategoryMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {/* El botón que activa el menú */}
          <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 text-gray-700">
            Categorías
          </NavigationMenuTrigger>
          
          {/* El contenido que se despliega */}
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] bg-white rounded-xl shadow-xl border border-gray-100">
              {categories.map((component) => (
                <li key={component.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={component.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <div className="text-sm font-medium leading-none text-gray-900">
                        {component.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-500 mt-1">
                        {component.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Enlace simple sin desplegable */}
        <NavigationMenuItem>
          <Link href="/ofertas" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-red-600">
              Ofertas
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  )
}