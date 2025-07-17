import Image from 'next/image';
import { getProductImages } from './product-images';

export const getImageUrl = (productName: string, type: 'main' | 'gallery' = 'main', index: number = 0): string => {
  const images = getProductImages(productName);
  
  if (type === 'main') {
    return images.main;
  }
  
  if (type === 'gallery' && index < images.gallery.length) {
    return images.gallery[index];
  }
  
  return '/images/products/default/gallery.jpg';
};
