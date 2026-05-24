import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
      {/* El componente SignIn lo hace todo por ti */}
      <SignIn />
    </div>
  );
}