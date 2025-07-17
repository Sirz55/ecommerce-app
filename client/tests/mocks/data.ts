export const mockProduct = {
  id: '1',
  title: 'Apple iPhone 14 Pro Max',
  description: 'The latest iPhone with advanced camera system and A16 Bionic chip',
  price: 129999,
  discount: 10,
  rating: 4.8,
  reviews: 1234,
  inStock: true,
  images: [
    '/images/products/iphone-14.jpg',
    '/images/products/iphone-14-back.jpg',
    '/images/products/iphone-14-side.jpg'
  ],
  specifications: {
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    storage: '256GB',
    color: 'Silver',
    camera: '48MP + 12MP + 12MP',
    battery: '4323mAh',
    display: '6.7-inch Super Retina XDR display'
  }
};

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/avatars/1.jpg',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    pincode: '10001'
  }
};

export const mockOrder = {
  id: '1',
  userId: mockUser.id,
  items: [
    {
      productId: mockProduct.id,
      quantity: 1,
      price: mockProduct.price,
      title: mockProduct.title
    }
  ],
  totalAmount: mockProduct.price,
  status: 'processing',
  createdAt: new Date()
};
