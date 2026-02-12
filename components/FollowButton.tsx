"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toggleFollowAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  sellerId: string;
  isFollowingInitial: boolean;
  isMe: boolean;
  isLoggedIn: boolean;
}

export default function FollowButton({ sellerId, isFollowingInitial, isMe, isLoggedIn }: Props) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  if (isMe) return null; // No mostrar si soy yo

  const handleToggle = () => {
    if (!isLoggedIn) {
      toast.error("Inicia sesión para seguir vendedores");
      return;
    }

    // Cambio Optimista (Visual inmediato)
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    startTransition(async () => {
      try {
        const result = await toggleFollowAction(sellerId);
        
        // ✅ CORREGIDO: Usamos "in" para comprobar si existe la propiedad error
        if (result && 'error' in result && result.error) {
          setIsFollowing(previousState); // Revertir si hubo error
          toast.error(result.error);
        }
      } catch (error) {
        setIsFollowing(previousState);
        toast.error("Error al conectar con el servidor");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95
        ${isFollowing 
          ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
          : "bg-gray-900 text-white hover:bg-gray-800 shadow-md shadow-gray-200"
        }
      `}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck size={14} /> 
          <span className="group-hover:hidden">Siguiendo</span>
          <span className="hidden group-hover:inline">Dejar de seguir</span>
        </>
      ) : (
        <>
          <UserPlus size={14} /> Seguir
        </>
      )}
    </button>
  );
}