"use client";
import { AddressForm } from '@/components/ui/address-form';
import { PaymentForm } from '@/components/ui/payment-form';
import { CartItem } from '@/components/ui/cart-item';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Radio, RadioProps } from '@/components/ui/radio';
import Link from 'next/link';
import { useState } from 'react';
import { RadioProps } from '@/components/ui/radio';

// Mock cart data
const cartItems = [
  {
    id: '1',
    title: 'Apple iPhone 14 Pro Max',
    price: 129999,
    image: '/images/iphone-14.jpg',
    quantity: 1,
    inStock: true,
  },
  {
    id: '2',
    title: 'Samsung Galaxy S23 Ultra',
    price: 119999,
    image: '/images/samsung-s23.jpg',
    quantity: 2,
    inStock: true,
  },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleAddressSubmit = (addressData) => {
    setAddress(addressData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Information</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Information</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Radio
                    value="credit"
                    checked={formData.paymentMethod === "credit"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePaymentChange(e.target.value)}
                  >
                    <div className="ml-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Credit Card</span>
                        <span className="text-sm text-muted-foreground">Pay with your credit card</span>
                      </div>
                    </div>
                  </Radio>
                  <Radio
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePaymentChange(e.target.value)}
                  >
                    <div className="ml-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">PayPal</span>
                        <span className="text-sm text-muted-foreground">Pay with your PayPal account</span>
                      </div>
                    </div>
                  </Radio>
                  <Radio
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePaymentChange(e.target.value)}
                  >
                    <div className="ml-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Cash on Delivery</span>
                        <span className="text-sm text-muted-foreground">Pay when you receive your order</span>
                      </div>
                    </div>
                  </Radio>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              <Card className="p-6 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹100</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{(calculateTotal() * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4 font-medium">
                    <span>Total</span>
                    <span>₹{(calculateTotal() + 100 + (calculateTotal() * 0.18)).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="flex justify-between space-x-4">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handlePlaceOrder}>
                Place Order
              </Button>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-4">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
