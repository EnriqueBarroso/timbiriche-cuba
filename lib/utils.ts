// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ Nueva función isAdmin
export const isAdmin = (email?: string): boolean => {
  if (!email) return false;
  return email === process.env.ADMIN_EMAIL;
};