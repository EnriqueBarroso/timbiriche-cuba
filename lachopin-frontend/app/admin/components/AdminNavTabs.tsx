"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, PackagePlus } from "lucide-react";

const TABS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sellers", label: "Vendedores", icon: Store },
  { href: "/admin/products", label: "Productos", icon: PackagePlus },
];

export default function AdminNavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-gray-200 mb-8">
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
