export const productImages = {
  'Apple iPhone 14 Pro Max': {
    main: '/images/products/iphone-14-pro-max/main.jpg',
    gallery: [
      '/images/products/iphone-14-pro-max/front.jpg',
      '/images/products/iphone-14-pro-max/back.jpg',
      '/images/products/iphone-14-pro-max/side.jpg',
      '/images/products/iphone-14-pro-max/display.jpg'
    ]
  },
  // Add more products as needed
};

export const getProductImages = (productName: string) => {
  const product = Object.entries(productImages).find(([name]) => 
    name.toLowerCase() === productName.toLowerCase()
  );
  
  if (product) {
    return product[1];
  }
  
  return {
    main: '/images/products/default/main.jpg',
    gallery: [
      '/images/products/default/gallery.jpg',
      '/images/products/default/gallery.jpg',
      '/images/products/default/gallery.jpg',
      '/images/products/default/gallery.jpg'
    ]
  };
};
