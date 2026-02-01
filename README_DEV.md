Informe Técnico de Proyecto: Timbiriche Cuba
Fecha: 1 de Febrero, 2026 Estado: MVP Funcional / Pre-producción Stack: Next.js 15 (App Router), TypeScript, Prisma, Supabase, Clerk, Cloudinary.

1. Resumen del Estado Actual
El proyecto es un Marketplace funcional. Los usuarios pueden registrarse, vender productos (subir imágenes), gestionar su carrito de compras y administrar sus publicaciones. Se ha implementado un sistema de Administración (Backoffice) básico basado en email.

El proyecto compila correctamente (npm run build) y está listo para despliegue en Vercel, habiendo superado problemas de tipado estricto y bloqueos de archivos en Windows.

2. Arquitectura y Configuración Crítica
A. Base de Datos & ORM
Provider: Supabase (PostgreSQL).

ORM: Prisma (@prisma/client).

Script de Build: Se modificó package.json para incluir la generación del cliente:

JSON
"build": "npx prisma generate && next build"
Problema conocido (Windows): Error EPERM al hacer build.

Solución: Cerrar terminales/servidor, borrar carpeta .prisma y .next y ejecutar npm run build.

B. Autenticación (Clerk)
Se usa Clerk para la gestión de usuarios.

Roles: No se usan "Custom Claims" todavía.

Admin: Se implementó un RBAC (Control de Acceso Basado en Roles) "hardcoded" en el frontend y backend comprobando un email específico.

C. Gestión de Imágenes (Cloudinary)
Modo: Unsigned (Sin firma).

Preset Name: timbiriche_preset (Debe coincidir exactamente en Cloudinary y en .env).

Cloud Name: dxberqeqr.

Fix Importante: Se eliminó la variable CLOUDINARY_URL del .env porque contenía caracteres < > que rompían el build.

3. Componentes Clave y Lógica Implementada
🛒 Contexto del Carrito (CartContext.tsx)
Se desacopló el tipo CartItem del tipo Product de Prisma para evitar conflictos de tipado (image vs images).

Lógica: Al añadir un item, el contexto extrae la primera imagen del array images de Prisma y la guarda como un string simple (image) en el carrito.

Persistencia: Usa localStorage.

👮‍♂️ Panel de Administración (/admin)
Ruta: app/admin/page.tsx.

Seguridad: Verifica currentUser().email contra una constante ADMIN_EMAIL.

Funciones:

Verificar Vendedores (isVerified: true).

Borrar productos (prisma.product.delete).

Acceso: Botón "ADMIN" en el Navbar visible solo para el email autorizado.

🧭 Navbar (Navbar.tsx)
Se implementó Suspense para envolver el uso de useSearchParams, evitando errores de compilación en Next.js.

Exportación: Se corrigió a export default para compatibilidad con layout.tsx.

Hydration: Se añadió un eslint-disable en el useEffect de montaje para evitar warnings de renderizado.

🖼️ Manejo de Imágenes (ProductCard.tsx)
Se implementó un sistema de fallback robusto para evitar errores 404 o nulos:

Intenta cargar product.images[0].url.

Si falla, intenta product.image (legacy).

Si falla, usa placehold.co (Dominio añadido a next.config.ts).