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
import { CATEGORIES } from "@/lib/categories";

export default function CategoryMenu() {
  // Filtramos 'all' y tomamos solo las primeras 4 o todas, según diseño.
  const displayCategories = CATEGORIES.filter(c => c.id !== 'all').slice(0, 6);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 text-gray-700">
            Categorías
          </NavigationMenuTrigger>
          
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {displayCategories.map((cat) => (
                <li key={cat.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/?category=${cat.id}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <div className="text-sm font-medium leading-none text-gray-900">
                        {cat.icon && <cat.icon className="inline w-4 h-4 mr-2 mb-0.5"/>}
                        {cat.label}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-500 mt-1">
                        {cat.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href="/ofertas" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-red-600 font-bold">
              🔥 Ofertas Flash
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}