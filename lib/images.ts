// lib/images.ts
export const getProductImage = (product: any): string => {
  // Array de imágenes
  if (product.images?.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url;
    }
    if (typeof firstImage === 'string') {
      return firstImage;
    }
  }
  
  // Imagen simple (string)
  if (product.image && typeof product.image === 'string') {
    return product.image;
  }
  
  // Placeholder
  return "https://placehold.co/600x400/e5e5e5/666?text=Sin+Foto";
};