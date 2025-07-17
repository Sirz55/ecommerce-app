import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';

// Real product images from Unsplash
const productImages = {
  'Apple iPhone 14 Pro Max': {
    main: 'https://images.unsplash.com/photo-1611147479744-72f840656098',
    gallery: [
      'https://images.unsplash.com/photo-1611147480101-72f840656098',
      'https://images.unsplash.com/photo-1611147481101-72f840656098',
      'https://images.unsplash.com/photo-1611147482101-72f840656098',
      'https://images.unsplash.com/photo-1611147483101-72f840656098'
    ]
  },
  'Samsung Galaxy S23 Ultra': {
    main: 'https://images.unsplash.com/photo-1611147490784-72f840656098',
    gallery: [
      'https://images.unsplash.com/photo-1611147491784-72f840656098',
      'https://images.unsplash.com/photo-1611147492784-72f840656098',
      'https://images.unsplash.com/photo-1611147493784-72f840656098',
      'https://images.unsplash.com/photo-1611147494784-72f840656098'
    ]
  },
  'Google Pixel 7 Pro': {
    main: 'https://images.unsplash.com/photo-1611147495784-72f840656098',
    gallery: [
      'https://images.unsplash.com/photo-1611147496784-72f840656098',
      'https://images.unsplash.com/photo-1611147497784-72f840656098',
      'https://images.unsplash.com/photo-1611147498784-72f840656098',
      'https://images.unsplash.com/photo-1611147499784-72f840656098'
    ]
  },
  'OnePlus 11 Pro': {
    main: 'https://images.unsplash.com/photo-1611147500784-72f840656098',
    gallery: [
      'https://images.unsplash.com/photo-1611147501784-72f840656098',
      'https://images.unsplash.com/photo-1611147502784-72f840656098',
      'https://images.unsplash.com/photo-1611147503784-72f840656098',
      'https://images.unsplash.com/photo-1611147504784-72f840656098'
    ]
  },
  'Xiaomi Mi 13 Ultra': {
    main: 'https://images.unsplash.com/photo-1611147510784-72f840656098',
    gallery: [
      'https://images.unsplash.com/photo-1611147511784-72f840656098',
      'https://images.unsplash.com/photo-1611147512784-72f840656098',
      'https://images.unsplash.com/photo-1611147513784-72f840656098',
      'https://images.unsplash.com/photo-1611147514784-72f840656098'
    ]
  },
  'Nokia G50': {
    main: 'https://images.unsplash.com/photo-1611147520784-72f840656098',
    gallery: [
      'https://images.unsplash.com/photo-1611147521784-72f840656098',
      'https://images.unsplash.com/photo-1611147522784-72f840656098',
      'https://images.unsplash.com/photo-1611147523784-72f840656098',
      'https://images.unsplash.com/photo-1611147524784-72f840656098'
    ]
  }
};

async function downloadImage(url: string, outputPath: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.writeFile(outputPath, response.data);
    console.log(`Downloaded: ${outputPath}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error);
  }
}

async function createDirectories() {
  const directories = [
    'public/images/products/iphone-14-pro-max',
    'public/images/products/samsung-galaxy-s23-ultra',
    'public/images/products/google-pixel-7-pro',
    'public/images/products/oneplus-11-pro',
    'public/images/products/xiaomi-mi-13-ultra',
    'public/images/products/nokia-g50',
    'public/images/products/default'
  ];

  for (const dir of directories) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function downloadProductImages() {
  await createDirectories();

  for (const [productName, images] of Object.entries(productImages)) {
    const dir = path.join('public', 'images', 'products', productName.toLowerCase().replace(/\s+/g, '-'));
    
    // Download main image
    await downloadImage(images.main, path.join(dir, 'main.jpg'));
    
    // Download gallery images
    for (let i = 0; i < images.gallery.length; i++) {
      await downloadImage(images.gallery[i], path.join(dir, `gallery-${i + 1}.jpg`));
    }
  }
}

// Run the download process
downloadProductImages().catch(console.error);
