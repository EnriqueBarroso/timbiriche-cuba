"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminButton() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (!user?.emailAddresses[0]?.emailAddress) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch('/api/check-admin');
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, [user]);

  if (!isAdmin) return null;

  return (
    <Link 
      href="/admin" 
      className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200"
    >
      <ShieldAlert className="w-5 h-5" />
      <span className="hidden md:inline">Panel Admin</span>
    </Link>
  );
}