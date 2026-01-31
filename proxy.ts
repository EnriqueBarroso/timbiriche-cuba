// proxy.ts (nueva convención de Next.js 15+)
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|map|mp4|webm)$/i;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Deja pasar assets y rutas públicas sin age-gate
  const isPublic =
    pathname === '/age' ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg' ||
    pathname === '/icon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/_next') ||        // estáticos de Next + /_next/image
    pathname.startsWith('/api') ||
    pathname.startsWith('/media') ||        // tus imágenes en /public/media
    PUBLIC_FILE.test(pathname);             // cualquier archivo estático por extensión

  if (isPublic) return NextResponse.next();

  // ⚠️ Age gate: redirige a /age si no tiene la cookie
  const hasCookie = req.cookies.get('age_ok')?.value === '1';
  if (!hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/age';
    url.searchParams.set('returnTo', pathname + (req.nextUrl.search || ''));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configuración para especificar en qué rutas se ejecuta
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};