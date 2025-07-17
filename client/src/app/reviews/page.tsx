import { useState } from 'react';
import { cn } from '@/components/ui/utils';

// Mock review data
const product = {
  id: '1',
  title: 'Apple iPhone 14 Pro Max',
  image: '/images/iphone-14.jpg',
  averageRating: 4.8,
  totalReviews: 1234,
  price: 129999,
};

const reviews = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: '/images/avatars/1.jpg',
      verified: true,
    },
    rating: 5,
    title: 'Excellent phone!',
    content: 'This is one of the best phones I have ever used. The camera quality is amazing and the battery life is great. Highly recommended!',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    helpful: 123,
    unhelpful: 12,
  },
  {
    id: '2',
    user: {
      name: 'Jane Smith',
      avatar: '/images/avatars/2.jpg',
      verified: true,
    },
    rating: 4,
    title: 'Great phone, minor issues',
    content: 'The phone is great overall, but I wish the battery lasted a bit longer. The camera is fantastic though!',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    helpful: 89,
    unhelpful: 5,
  },
  {
    id: '3',
    user: {
      name: 'Bob Johnson',
      avatar: '/images/avatars/3.jpg',
      verified: false,
    },
    rating: 3,
    title: 'Good but could be better',
    content: 'The phone is good but I had some issues with the software. Needs more updates.',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    helpful: 45,
    unhelpful: 15,
  },
];

// Mock rating distribution
const ratingDistribution = {
  5: 700,
  4: 400,
  3: 100,
  2: 20,
  1: 14,
};

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'verified') return review.user.verified;
    if (selectedFilter === 'helpful') return review.helpful > 50;
    return false;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortOption === 'helpful') {
      return b.helpful - a.helpful;
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= product.averageRating ? "text-yellow-400" : "text-gray-300"
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({product.totalReviews} reviews)
              </span>
            </div>
            <p className="text-lg font-medium text-gray-900 mt-2">₹{product.price}</p>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {/* Filters */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={cn(
                "px-4 py-2 text-sm rounded-md",
                selectedFilter === 'all' ? "bg-[#232F3E] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              All Reviews
            </button>
            <button
              onClick={() => setSelectedFilter('verified')}
              className={cn(
                "px-4 py-2 text-sm rounded-md",
                selectedFilter === 'verified' ? "bg-[#232F3E] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Verified Purchases
            </button>
            <button
              onClick={() => setSelectedFilter('helpful')}
              className={cn(
                "px-4 py-2 text-sm rounded-md",
                selectedFilter === 'helpful' ? "bg-[#232F3E] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Most Helpful
            </button>
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 text-sm rounded-md border border-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Rating Breakdown</h2>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">{rating} star</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-48 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#232F3E] rounded-full"
                    style={{ width: `${(ratingDistribution[rating] / product.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{ratingDistribution[rating]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              {/* User Info */}
              <div className="relative w-10 h-10">
                <Image
                  src={review.user.avatar}
                  alt={review.user.name}
                  fill
                  className="object-cover rounded-full"
                  sizes="40px"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {review.user.name}
                  {review.user.verified && (
                    <span className="ml-2 text-sm text-[#232F3E]">Verified Purchase</span>
                  )}
                </h3>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= review.rating ? "text-yellow-400" : "text-gray-300"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">{review.title}</h4>
              <p className="text-sm text-gray-500 mb-4">{review.content}</p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {review.date.toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-gray-500 hover:text-[#232F3E]">
                    Helpful ({review.helpful})
                  </button>
                  <button className="text-sm text-gray-500 hover:text-[#232F3E]">
                    Unhelpful ({review.unhelpful})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review */}
      <div className="mt-8">
        <button
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}
