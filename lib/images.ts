export const getProductImage = (product: any): string => {
  const PLACEHOLDER = "https://placehold.co/600x400/e5e5e5/666?text=Sin+Foto";

  if (!product) return PLACEHOLDER;

  if (product.images?.length > 0) {
    const firstImage = product.images[0];
    
    if (typeof firstImage === 'object' && firstImage.url && firstImage.url.startsWith('http')) {
      return firstImage.url;
    }
    
   
    if (typeof firstImage === 'string' && firstImage.startsWith('http')) {
      return firstImage;
    }
  }

  if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
    return product.image;
  }
  
  return PLACEHOLDER;
};