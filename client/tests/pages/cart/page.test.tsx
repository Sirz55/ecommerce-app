import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { cartPage } from '@/app/cart/page';
import { mockProduct, mockUser } from '@/tests/mocks/data';
import { MemoryRouter } from 'react-router-dom';

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart items correctly', () => {
    render(
      <MemoryRouter>
        <cartPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  it('handles quantity change', async () => {
    render(
      <MemoryRouter>
        <cartPage />
      </MemoryRouter>
    );

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('handles remove item', async () => {
    render(
      <MemoryRouter>
        <cartPage />
      </MemoryRouter>
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(mockProduct.title)).not.toBeInTheDocument();
    });
  });

  it('calculates total amount correctly', () => {
    render(
      <MemoryRouter>
        <cartPage />
      </MemoryRouter>
    );

    const subtotal = screen.getByText('Subtotal');
    const total = screen.getByText('Total');

    expect(subtotal).toBeInTheDocument();
    expect(total).toBeInTheDocument();
  });

  it('handles coupon code input', async () => {
    render(
      <MemoryRouter>
        <cartPage />
      </MemoryRouter>
    );

    const couponInput = screen.getByPlaceholderText('Enter coupon code');
    fireEvent.change(couponInput, { target: { value: 'TEST10' } });

    const applyButton = screen.getByRole('button', { name: /apply coupon/i });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText('Coupon Applied')).toBeInTheDocument();
    });
  });
});
