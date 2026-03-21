import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAdmin = (email?: string): boolean => {
  if (!email) return false;
  return email === process.env.ADMIN_EMAIL;
};

export function formatPrice(amount: number, currency: string = "USD") {
  // 1. SIN MATEMÁTICAS: El precio es el que es.
  const price = amount;

  // 2. Formateamos el número
  const number = new Intl.NumberFormat("es-CU", {
    style: "decimal",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2, // Si es redondo (500) no muestra decimales
    maximumFractionDigits: 2,
  }).format(price);

  // 3. RETORNO VISUAL:
  // Si es CUP -> "500 CUP"
  // Si es otro -> "$500 USD"
  if (currency === "CUP") {
    return `${number} CUP`;
  }

  return `$${number} ${currency}`;
}
// Placeholder blur genérico (gris neutro, ~100 bytes)
export const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIklEQVQYV2N88ODBfwYGBgZGRkYGJgYKABMDhYCRYhMA/70EBf4CmOkAAAAASUVORK5CYII=";

// Generador de slug automático
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export function optimizeImage(url: string, width: number = 400): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  
  // Inserta transformaciones después de /upload/
  return url.replace(
    "/upload/",
    `/upload/w_${width},q_auto,f_auto/`
  );
}
