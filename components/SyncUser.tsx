"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserAction } from "@/lib/actions";

export default function SyncUser() {
  const { user, isLoaded } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !hasSynced.current) {
      hasSynced.current = true;
      syncUserAction();
    }
  }, [user, isLoaded]);

  return null;
}