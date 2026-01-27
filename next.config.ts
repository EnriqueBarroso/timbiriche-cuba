/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Permitimos fotos de Cloudinary
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Permitimos placeholders si usas
      },
    ],
  },
};

export default nextConfig;