# Lachopin — Guía de referencia (marketplace-cuba)

Monorepo con dos paquetes independientes (sin package.json raíz):

- **lachopin-frontend/** — Next.js 16 (App Router), Tailwind v4, Clerk, Prisma (lectura), desplegado en Vercel.
- **lachopin-api/** — NestJS 11 + Prisma (PostgreSQL/Supabase), desplegado por separado.
  ⚠️ `lachopin-api/` está en `.gitignore` (contiene `.env` con credenciales de BD) — no se versiona desde este repo.

## Enfoque del proyecto

Lachopin está en transición de marketplace P2P (particulares vendiendo a particulares) hacia una
**plataforma B2B multi-tenant** para negocios en Cuba: varios negocios operando sobre la misma base,
cada uno con su propia tienda pública y panel de gestión. El modelo `Seller` fue renombrado a
`Business` (schema, backend y frontend) para reflejar ese enfoque; sigue siendo 1:1 con `User`
(`Business.ownerUserId`, un usuario = un negocio) — el aislamiento multi-tenant completo (varios
usuarios/roles por negocio) todavía no se ha hecho.

## Cómo correr el proyecto

```bash
# Frontend (http://localhost:3000)
cd lachopin-frontend
npm install
npm run dev

# Backend (http://localhost:3002 — puerto fijado en lachopin-api/.env vía PORT)
cd lachopin-api
npm install
npm run start:dev
```

`npm run build` del frontend requiere `npx prisma generate && next build` (ver README_DEV.md). En Windows, errores EPERM se resuelven cerrando terminales y limpiando `.prisma`/`.next`.

⚠️ **`next.config.ts` (images.remotePatterns) NO se recarga en caliente** — si se agrega un hostname nuevo a `remotePatterns`, hay que reiniciar `npm run dev`.

## Estructura — Frontend

- `app/` — rutas (App Router). Páginas clave: `/`, `/categorias`, `/product/[id]`, `/vender/nuevo`, `/vender/nuevo-plato`, `/vendedor/[slug]`, `/vendedor/dashboard`, `/perfil`, `/favoritos`, `/mis-publicaciones`, `/eats`, `/admin`, `/sign-in`, `/sign-up`, `/checkout`, `/carrito`.
- `components/` — UI (ProductCard, CategoryCard, HeroCarousel, Navbar, Newsletter, MainWrapper, ui/* shadcn-style).
- `contexts/` — `CartContext` (persistencia localStorage), `FavoritesContext`.
- `lib/`:
  - `api.ts` — cliente HTTP (`apiFetch`) hacia el backend, tipos Product/Business/Order/Favorite.
  - `actions.ts` — Server Actions (checks de admin, gestión de productos/vendedores).
  - `categories.ts` — definición única de categorías (id, label, icon, **image**, subcategories) — fuente para `/categorias` y filtros.
  - `utils.ts` — helpers (`isAdmin`, `formatPrice`, `optimizeImage`, `BLUR_PLACEHOLDER`).
  - `redis.ts` — cliente Upstash Redis (rate limiting).
- `proxy.ts` — middleware: auth Clerk + rate limiting (Upstash). Rutas protegidas: `/vender`, `/perfil`, `/api/upload`, `/editar`. Públicas: `/vendedor`, `/product`. Si Redis/Clerk fallan, degrada de forma controlada (no rompe rutas públicas).

### Convención CATEGORY_IMAGES (home) vs lib/categories.ts (/categorias)

- `app/page.tsx` define su propio `CATEGORY_IMAGES` con slugs: `cellphones, vehicles, home, appliances, fashion, food, parts, crafts, others`.
- `lib/categories.ts` define `CATEGORIES` con ids: `all, food, parts, home, logistics, tech, fashion` (cada uno con campo `image`).
- **Son dos taxonomías distintas** (la home usa slugs "comerciales" más granulares; `/categorias` usa ids más generales del filtro de productos). Si se edita una, revisar si la otra necesita el mismo cambio.

## Estructura — Backend (lachopin-api)

- `src/auth/` — `ClerkAuthGuard` (verifica Bearer token con `@clerk/backend`), `clerk-client.ts` (instancia de `@clerk/backend` para resolver usuarios desde el backend).
- `src/products/`, `src/businesses/`, `src/orders/`, `src/users/` — CRUD + lógica de negocio (filtros, vistas, ofertas flash, seguidores, verificación de negocios).
- `src/prisma.service.ts` — conexión Prisma singleton.
- `main.ts` — CORS desde `FRONTEND_URL`, Helmet, `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`).

## Modelos Prisma (compartidos)

- **User** — id, email; relaciones a `orders`, `favorites` y `business` (el negocio del que es dueño, 1:1).
- **Product** — title, description, price, currency, category, images[], isActive, isSold, isPromoted, isFlashOffer, views, businessId, `type: MARKETPLACE | EATS`.
- **ProductImage** — url, productId.
- **Business** (antes `Seller`) — ownerUserId (FK única a `User.id`), storeName, slug, email, phoneNumber, isVerified, isRestaurant, isFeatured, rating, reviews, avatar, coverImage, address, openTime/closeTime, acceptsZelle, zelleEmail.
- **Order** — buyerId, productId, businessId, status (default `"CONTACTADO"`).
- **Favorite** — (userId, productId) unique.
- **Follower** — (followerId, businessId) unique.

## Variables de entorno

**Frontend** (`.env.local`):
`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_EMAIL`, `RESEND_API_KEY`, Clerk publishable/secret keys.

**Backend** (`.env`):
`DATABASE_URL`, `FRONTEND_URL`, `PORT`, `CLERK_SECRET_KEY`.

## Auth

- Frontend: Clerk (`/sign-in`, `/sign-up`, middleware en `proxy.ts`). Usa `forceRedirectUrl` / `afterSignOutUrl` (NO usar `afterSignInUrl`/`afterSignUpUrl`, deprecados).
- Backend: `ClerkAuthGuard` valida Bearer token.
- Admin: chequeo hardcoded por email (`process.env.ADMIN_EMAIL`) vía `isAdmin()` en `lib/utils.ts`, centralizado en `lib/actions.ts` a través del helper privado `requireAdmin()` (evita repetir el check en cada Server Action).
- `Business.ownerUserId` es una FK única a `User.id` (1:1, un usuario = un negocio). La resolución de "el negocio del usuario autenticado" ya no compara emails: se hace por esa FK — `BusinessesService.getBusinessIdForClerkUser`/`findByOwnerUserId` en el backend, `getBusinessByOwnerId` en el frontend. `getBusinessByEmail`/`findByEmail` se mantienen solo para lookups por email de contacto conocido (p. ej. herramientas de admin), no para resolver el negocio del usuario actual.

### Estado de seguridad (ownership guards)

- ✅ **Corregido**: `products`, `businesses` y `orders` ya validan ownership en el backend, no solo en el frontend.
  - `ProductsController`: `POST /products` (`ProductCreateOwnershipGuard`) y `PATCH`/`DELETE /products/:id` (`ProductOwnershipGuard`) verifican que el `businessId` pertenezca al usuario autenticado.
  - `BusinessesController`: `PATCH /businesses/:id` (`BusinessOwnershipGuard`) verifica que el perfil pertenezca al usuario autenticado.
  - `OrdersController`: `POST /orders` fuerza `buyerId` desde el token (no desde el body); `GET /orders` requiere `ClerkAuthGuard` y filtra a pedidos donde el usuario es buyer o business.
  - Todos estos guards viven junto a su controller (`src/products/guards/`, `src/businesses/guards/`) y reutilizan `BusinessesService.getBusinessIdForClerkUser`.
- ⚠️ **Pendiente**: los campos admin-only (`isVerified`, `isFeatured` en `Business`; `isPromoted` en `Product`) todavía no tienen gate en el backend — hoy solo el frontend restringe quién los cambia (`togglePromotedStatus`, `toggleBusinessFeaturedStatus` en `lib/actions.ts`, gateadas por `requireAdmin()`). Cualquier negocio autenticado podría en teoría setearlos vía `PATCH` directo a la API. Cerrar esto cuando se trabaje un sistema de roles real (hoy solo existe el email hardcoded de admin, sin roles en Clerk/DB).

## Imágenes (Cloudinary + Next/Image)

- Subida sin firma (`unsigned`), preset `timbiriche_uploads`, cloud `dxberqeqr`.
- Fallback de imagen de producto: `product.images[0].url` → `product.image` → `placehold.co`.
- `next.config.ts` → `images.remotePatterns`: `res.cloudinary.com`, `img.clerk.com`, `ui-avatars.com`, `placehold.co`, `images.unsplash.com`, `*.fbcdn.net`, `lh3.googleusercontent.com`.

### ⚠️ Gotchas con `next/image fill`

1. El **padre directo** de `<Image fill>` debe tener `position: relative` (o `absolute`/`fixed`). Si no, Next.js muestra warning en consola y la imagen no se ve.
2. Si ese padre es un `<Link>` (renderiza `<a>`, `display: inline` por defecto) y se le da tamaño vía `aspect-[w/h]`, **`aspect-ratio` no aplica a elementos `inline`** → altura colapsa a 0 → "Image ... has fill and a height value of 0". Solución: agregar `block` (o `flex`) al className del `<Link>`/`<a>`.
   - Caso real corregido: `components/CategoryCard.tsx` (`className="group relative block overflow-hidden rounded-2xl aspect-[16/10] bg-muted"`).
3. `components/ProductCard.tsx` tiene el mismo patrón correcto: `<Link className="relative block h-full w-full">`.

## Animaciones

- `framer-motion` vía `components/ui/animate-on-scroll.tsx` (`AnimateOnScroll`, props `direction`, `delay`, `whileInView`/`viewport`).

## Notas de estado (README_DEV.md)

- MVP funcional, pre-producción.
- Stack: Next.js 16, TypeScript, Prisma, Supabase (Postgres), Clerk, Cloudinary.
- Navbar usa `Suspense` para `useSearchParams`.
