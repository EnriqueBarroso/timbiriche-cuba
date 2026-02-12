import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================
// 🔒 RATE LIMITER EN MEMORIA
// ============================================
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_CONFIG = {
  // Rutas de escritura (crear/editar productos, upload)
  write: { windowMs: 60 * 1000, maxRequests: 10 },  // 10 por minuto
  // API routes generales
  api: { windowMs: 60 * 1000, maxRequests: 30 },     // 30 por minuto
};

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 5 * 60 * 1000);

function isRateLimited(key: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > maxRequests;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ============================================
// 🛡️ RUTAS PROTEGIDAS (CLERK)
// ============================================
const isProtectedRoute = createRouteMatcher([
  '/vender(.*)',
  '/perfil(.*)',
  '/api/upload(.*)',
  '/editar(.*)',
]);

// Rutas de escritura (rate limit estricto)
const isWriteRoute = createRouteMatcher([
  '/api/upload(.*)',
  '/vender(.*)',
  '/editar(.*)',
]);

// Rutas API (rate limit moderado)
const isApiRoute = createRouteMatcher([
  '/api/(.*)',
]);

// ============================================
// 🚀 MIDDLEWARE PRINCIPAL
// ============================================
export default clerkMiddleware(async (auth, req) => {
  const ip = getClientIp(req);

  // Rate limiting para rutas de escritura
  if (isWriteRoute(req)) {
    const key = `write:${ip}`;
    if (isRateLimited(key, RATE_LIMIT_CONFIG.write.windowMs, RATE_LIMIT_CONFIG.write.maxRequests)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta en un minuto." },
        { status: 429 }
      );
    }
  }

  // Rate limiting para API routes
  if (isApiRoute(req)) {
    const key = `api:${ip}`;
    if (isRateLimited(key, RATE_LIMIT_CONFIG.api.windowMs, RATE_LIMIT_CONFIG.api.maxRequests)) {
      return NextResponse.json(
        { error: "Límite de solicitudes alcanzado. Intenta en un minuto." },
        { status: 429 }
      );
    }
  }

  // Clerk auth para rutas protegidas
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};