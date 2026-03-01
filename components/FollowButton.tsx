"use client";

import { useState, useTransition } from "react";
import { toggleFollowAction } from "@/lib/actions"; // Ajusta la ruta si es necesario
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  sellerId: string;
  isFollowingInitial: boolean;
  isMe: boolean;
  isLoggedIn: boolean;
}

export default function FollowButton({
  sellerId,
  isFollowingInitial,
  isMe,
  isLoggedIn,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (isMe) return null; // No mostrar si es tu propio perfil

  const handleFollow = () => {
    // 1. Validar login ANTES de llamar al servidor
    if (!isLoggedIn) {
      router.push("/sign-in"); // Redirigir a Clerk si no está logueado
      return;
    }

    // 2. Optimistic UI (Cambio visual inmediato)
    setIsFollowing(!isFollowing);

    // 3. Ejecutar la acción del servidor en background
    startTransition(async () => {
      try {
        const result = await toggleFollowAction(sellerId);
        
        // Si hay error (ej. intentar seguirse a sí mismo), revertir visualmente
        if (result && "error" in result) {
            setIsFollowing(isFollowing);
            console.error(result.error);
            return;
        }

        // Refrescar la ruta para actualizar el contador de seguidores en el layout
        router.refresh(); 

      } catch (error) {
        // Si el POST falla, revertimos el botón
        setIsFollowing(isFollowing);
        console.error("Error al intentar seguir:", error);
      }
    });
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70 ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isFollowing ? (
        <>
          <UserMinus size={18} /> Dejar de seguir
        </>
      ) : (
        <>
          <UserPlus size={18} /> Seguir
        </>
      )}
    </button>
  );
}