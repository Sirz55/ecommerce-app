import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';

// Mock order data
const orders = [
  {
    id: 'ORD123456789',
    date: new Date(),
    status: 'Delivered',
    total: 369997,
    items: 3,
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD123456788',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'Processing',
    total: 259999,
    items: 2,
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD123456787',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'Cancelled',
    total: 129999,
    items: 1,
    paymentStatus: 'Refunded',
  },
];

export default function OrderHistoryPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-sm text-gray-500">Track your past orders and view order details</p>
      </div>

      {/* Status Filter */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedStatus('all')}
            className={cn(
              "px-4 py-2 border rounded-md text-sm font-medium",
              selectedStatus === 'all'
                ? "border-[#232F3E] bg-[#232F3E] text-white"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            All Orders
          </button>
          <button
            onClick={() => setSelectedStatus('Delivered')}
            className={cn(
              "px-4 py-2 border rounded-md text-sm font-medium",
              selectedStatus === 'Delivered'
                ? "border-[#232F3E] bg-[#232F3E] text-white"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            Delivered
          </button>
          <button
            onClick={() => setSelectedStatus('Processing')}
            className={cn(
              "px-4 py-2 border rounded-md text-sm font-medium",
              selectedStatus === 'Processing'
                ? "border-[#232F3E] bg-[#232F3E] text-white"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            Processing
          </button>
          <button
            onClick={() => setSelectedStatus('Cancelled')}
            className={cn(
              "px-4 py-2 border rounded-md text-sm font-medium",
              selectedStatus === 'Cancelled'
                ? "border-[#232F3E] bg-[#232F3E] text-white"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterOrders(selectedStatus).map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.date.toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={order.status === 'Delivered' ? 'success' : 'info'}>
                  {order.status}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {order.items} item{order.items > 1 ? 's' : ''}
                </p>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href={`/order/${order.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <Link
            href="/"
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Previous
          </Link>
          <Link
            href="/"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            1
          </Link>
          <Link
            href="/"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            2
          </Link>
          <Link
            href="/"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            3
          </Link>
          <Link
            href="/"
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Next
          </Link>
        </nav>
      </div>
    </div>
  );
}
