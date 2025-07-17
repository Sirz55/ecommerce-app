import { CartItem } from '@/components/ui/cart-item';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock order data
const order = {
  id: 'ORD123456789',
  date: new Date(),
  status: 'Processing',
  items: [
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
  ],
  deliveryAddress: {
    fullName: 'John Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    mobileNumber: '1234567890',
  },
  payment: {
    method: 'Credit Card',
    amount: 369997,
    status: 'Paid',
  },
  delivery: {
    expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'Processing',
    trackingNumber: 'TRK987654321',
  },
};

export default function OrderConfirmationPage() {
  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed</h1>
        <p className="text-sm text-gray-500">
          Thank you for your order! We've received your order and will begin processing it right away.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-8">
          {/* Order Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">Order Number:</span>
                <span className="ml-2 text-sm text-gray-500">{order.id}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">Order Date:</span>
                <span className="ml-2 text-sm text-gray-500">
                  {order.date.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">Order Status:</span>
                <Badge variant={order.status === 'Delivered' ? 'success' : 'info'}>
                  {order.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onQuantityChange={() => {}}
                  onRemove={() => {}}
                />
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-500">
                  {order.deliveryAddress.fullName}<br />
                  {order.deliveryAddress.address}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}<br />
                  Mobile: {order.deliveryAddress.mobileNumber}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Expected Delivery</h3>
                <p className="text-sm text-gray-500">
                  {order.delivery.expectedDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tracking Number</h3>
                <p className="text-sm text-gray-500">{order.delivery.trackingNumber}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h3>
                <p className="text-sm text-gray-500">{order.payment.method}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Status</h3>
                <Badge variant={order.payment.status === 'Paid' ? 'success' : 'info'}>
                  {order.payment.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Total Amount</h3>
                <p className="text-sm text-gray-500">₹{calculateTotal().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8">
            <div className="flex space-x-4">
              <Link
                href="/orders"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
              >
                View Order History
              </Link>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
