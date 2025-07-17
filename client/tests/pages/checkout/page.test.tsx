import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { checkoutPage } from '@/app/checkout/page';
import { mockUser, mockOrder } from '@/tests/mocks/data';
import { MemoryRouter } from 'react-router-dom';

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders checkout steps correctly', () => {
    render(
      <MemoryRouter>
        <checkoutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('handles address form submission', async () => {
    render(
      <MemoryRouter>
        <checkoutPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const mobileInput = screen.getByLabelText('Mobile Number');
    const pincodeInput = screen.getByLabelText('Pincode');
    const addressInput = screen.getByLabelText('Address');
    const cityInput = screen.getByLabelText('City');
    const stateInput = screen.getByLabelText('State');

    fireEvent.change(nameInput, { target: { value: mockUser.name } });
    fireEvent.change(mobileInput, { target: { value: '9876543210' } });
    fireEvent.change(pincodeInput, { target: { value: '123456' } });
    fireEvent.change(addressInput, { target: { value: mockUser.address.street } });
    fireEvent.change(cityInput, { target: { value: mockUser.address.city } });
    fireEvent.change(stateInput, { target: { value: mockUser.address.state } });

    const continueButton = screen.getByRole('button', { name: /continue to payment/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument();
    });
  });

  it('handles payment form submission', async () => {
    render(
      <MemoryRouter>
        <checkoutPage />
      </MemoryRouter>
    );

    // Skip to payment form
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));

    const cardNumberInput = screen.getByLabelText('Card Number');
    const expiryInput = screen.getByLabelText('Expiry');
    const cvvInput = screen.getByLabelText('CVV');

    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    fireEvent.change(expiryInput, { target: { value: '12/25' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });

    const payButton = screen.getByRole('button', { name: /pay now/i });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText('Order Placed Successfully')).toBeInTheDocument();
    });
  });

  it('shows order summary correctly', () => {
    render(
      <MemoryRouter>
        <checkoutPage />
      </MemoryRouter>
    );

    expect(screen.getByText(mockOrder.items[0].title)).toBeInTheDocument();
    expect(screen.getByText(`₹${mockOrder.totalAmount}`)).toBeInTheDocument();
    expect(screen.getByText(mockOrder.status)).toBeInTheDocument();
  });
});
