/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Para las imágenes de tus productos
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // Para los avatares generados por defecto
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Para las fotos de perfil de usuarios de Clerk
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Por si usas fotos de prueba de Unsplash
      },
    ],
  },
};

export default nextConfig;