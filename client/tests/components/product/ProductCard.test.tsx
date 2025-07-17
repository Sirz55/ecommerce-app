import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProduct } from '@/tests/mocks/data';

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(`₹${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument();
  });

  it('handles add to cart click', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('handles wishlist click', () => {
    const mockAddToWishlist = jest.fn();
    render(<ProductCard product={mockProduct} onAddToWishlist={mockAddToWishlist} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to wishlist/i }));
    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct);
  });

  it('shows out of stock badge when product is not available', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('shows discount badge when product has discount', () => {
    const discountedProduct = { ...mockProduct, discount: 20 };
    render(<ProductCard product={discountedProduct} />);
    
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });
});
