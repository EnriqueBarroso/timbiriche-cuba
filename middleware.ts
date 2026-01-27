// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definimos qué rutas son protegidas
const isProtectedRoute = createRouteMatcher([
  '/vender(.*)', // Protege /vender y todo lo que esté dentro
  '/perfil(.*)', // Protege /perfil
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecutar para rutas API
    '/(api|trpc)(.*)',
  ],
};