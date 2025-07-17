import { useState } from 'react';
import { cn } from '@/components/ui/utils';

// Mock support categories
const categories = [
  {
    id: '1',
    name: 'Order Issues',
    description: 'Track your order, delivery updates, and shipping issues',
    icon: 'package',
    subcategories: [
      'Order Status',
      'Delivery Issues',
      'Missing Items',
      'Order Cancellation',
    ],
  },
  {
    id: '2',
    name: 'Payment Issues',
    description: 'Payment methods, failed transactions, and refund issues',
    icon: 'credit-card',
    subcategories: [
      'Payment Failure',
      'Refund Status',
      'Payment Methods',
      'Billing Issues',
    ],
  },
  {
    id: '3',
    name: 'Product Issues',
    description: 'Product availability, returns, and warranty issues',
    icon: 'shopping-bag',
    subcategories: [
      'Product Availability',
      'Returns & Refunds',
      'Warranty Claims',
      'Product Quality',
    ],
  },
  {
    id: '4',
    name: 'Account Issues',
    description: 'Account access, password reset, and profile management',
    icon: 'user',
    subcategories: [
      'Login Issues',
      'Password Reset',
      'Profile Updates',
      'Account Security',
    ],
  },
];

// Mock support tickets
const tickets = [
  {
    id: '1',
    title: 'Order #123456789 - Delivery Delay',
    status: 'Open',
    priority: 'High',
    category: 'Order Issues',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Payment Failed for Order #987654321',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Payment Issues',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Product #567890123 - Missing Item',
    status: 'Closed',
    priority: 'Low',
    category: 'Product Issues',
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    if (selectedCategory && ticket.category !== selectedCategory) return false;
    if (searchQuery && !ticket.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Support</h1>
        <p className="text-sm text-gray-500">Get help with your orders, payments, and account issues</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search support topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:ring-[#232F3E] focus:border-[#232F3E]"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#232F3E] focus:border-[#232F3E]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Support Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#232F3E]/10 mb-4">
              <svg
                className="w-6 h-6 text-[#232F3E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {category.icon === 'package' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                )}
                {category.icon === 'credit-card' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 11-16 0 3 3 0 0116 0z"
                  />
                )}
                {category.icon === 'shopping-bag' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                )}
                {category.icon === 'user' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                )}
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{category.description}</p>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((subcategory) => (
                <span
                  key={subcategory}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {subcategory}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">My Support Tickets</h2>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border-b border-gray-200"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{ticket.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {ticket.category}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        ticket.priority === 'High' && "bg-red-100 text-red-700",
                        ticket.priority === 'Medium' && "bg-yellow-100 text-yellow-700",
                        ticket.priority === 'Low' && "bg-green-100 text-green-700"
                      )}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {ticket.lastUpdated.toLocaleDateString()}
                  </span>
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#232F3E]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="flex space-x-4">
          <button
            className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
          >
            Create New Ticket
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
