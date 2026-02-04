"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { syncUserAction } from "@/lib/actions";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      syncUserAction();
    }
  }, [user, isLoaded]);

  return null;
}