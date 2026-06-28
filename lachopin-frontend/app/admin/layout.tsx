import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";
import AdminNavTabs from "@/app/admin/components/AdminNavTabs";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!isAdmin(userEmail)) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Panel de Control
          </h1>
          <p className="text-gray-500">Bienvenido, Admin. Aquí mandas tú.</p>
        </header>

        <AdminNavTabs />

        {children}
      </div>
    </div>
  );
}
