import { ProfileSidebar } from '@/components/ui/profile-sidebar';
import { useState } from 'react';

// Mock user data
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 890',
  membership: {
    type: 'Prime',
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    benefits: [
      'Free Shipping',
      'Priority Support',
      'Exclusive Offers',
      'Early Access',
    ],
  },
  orders: 12,
  reviews: 8,
  points: 5000,
};

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('Profile');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-500">
                {user.name[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProfileSidebar activeSection={activeSection} />
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Membership Card */}
            <div className="bg-[#232F3E] rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Prime Member</h2>
                  <p className="text-sm text-white/80">Expires {user.membership.expires.toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{user.orders}</span>
                    <span className="text-sm text-white/80">Orders</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{user.reviews}</span>
                    <span className="text-sm text-white/80">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{user.points}</span>
                    <span className="text-sm text-white/80">Points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={user.name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#232F3E] focus:ring-[#232F3E] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#232F3E] focus:ring-[#232F3E] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={user.phone}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#232F3E] focus:ring-[#232F3E] sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Membership Benefits */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Benefits</h3>
                <div className="space-y-2">
                  {user.membership.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg
                        className="h-4 w-4 text-[#232F3E]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
