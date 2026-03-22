import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ============================================
// 🔒 RATE LIMITER CON UPSTASH REDIS
// ============================================
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter para rutas de escritura: 10 requests por minuto
const writeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "rl:write",
});

// Rate limiter para API routes: 30 requests por minuto
const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "rl:api",
});

// Rate limiter para búsqueda (autocompletado): 60 requests por minuto
const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "rl:search",
});

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ============================================
// 🛡️ RUTAS (CLERK + RATE LIMIT)
// ============================================
const isProtectedRoute = createRouteMatcher([
  '/vender(.*)',
  '/perfil(.*)',
  '/api/upload(.*)',
  '/editar(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/vendedor(.*)',
  '/product(.*)',
]);

const isWriteRoute = createRouteMatcher([
  '/api/upload(.*)',
  '/vender(.*)',
  '/editar(.*)',
]);

const isApiRoute = createRouteMatcher([
  '/api/(.*)',
]);

const isSearchRoute = createRouteMatcher([
  '/api/search(.*)',
]);

// ============================================
// ⚙️ LÓGICA DE CLERK + RATE LIMITING
// ============================================
const clerkHandler = clerkMiddleware(async (auth, req) => {
  const ip = getClientIp(req);

  // Rate limiting para búsqueda (autocompletado)
  if (isSearchRoute(req)) {
    const { success } = await searchRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas búsquedas. Intenta en un momento." },
        { status: 429 }
      );
    }
  }
  // Rate limiting para rutas de escritura
  else if (isWriteRoute(req)) {
    const { success } = await writeRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta en un minuto." },
        { status: 429 }
      );
    }
  }
  // Rate limiting para API routes generales
  else if (isApiRoute(req)) {
    const { success } = await apiRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Límite de solicitudes alcanzado. Intenta en un minuto." },
        { status: 429 }
      );
    }
  }

  // Forzamos a Clerk a ignorar sus validaciones internas en las rutas públicas
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Clerk auth para rutas protegidas
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// ============================================
// 🚀 EXPORTACIÓN CON GRACEFUL DEGRADATION
// ============================================
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    return await clerkHandler(req, event);
  } catch (error) {
    console.error("🚨 [ESCUDO ACTIVO] Fallo crítico en Auth o Rate Limiter:", error);

    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    return new NextResponse(
      "El sistema de inicio de sesión está en mantenimiento. Los catálogos públicos siguen disponibles.",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};