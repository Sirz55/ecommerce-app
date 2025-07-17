import { useState } from 'react';
import { cn } from '@/components/ui/utils';

// Mock FAQ categories and questions
const categories = [
  {
    id: '1',
    name: 'Order & Shipping',
    icon: 'package',
    questions: [
      {
        id: '1',
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping is available for an additional fee.',
      },
      {
        id: '2',
        question: 'Can I track my order?',
        answer: 'Yes, you can track your order by signing in to your account and checking the order status.',
      },
      {
        id: '3',
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of delivery. Items must be unused and in original packaging.',
      },
    ],
  },
  {
    id: '2',
    name: 'Payment & Security',
    icon: 'credit-card',
    questions: [
      {
        id: '4',
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, UPI, net banking, and cash on delivery.',
      },
      {
        id: '5',
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption to protect your payment information.',
      },
      {
        id: '6',
        question: 'Can I cancel my order after payment?',
        answer: 'Orders can be cancelled before they are shipped. Contact support for assistance.',
      },
    ],
  },
  {
    id: '3',
    name: 'Product Information',
    icon: 'shopping-bag',
    questions: [
      {
        id: '7',
        question: 'How do I know if a product is authentic?',
        answer: 'All products are sourced directly from authorized sellers and come with original packaging.',
      },
      {
        id: '8',
        question: 'What is your warranty policy?',
        answer: 'We offer manufacturer warranties on all products. Check individual product pages for details.',
      },
      {
        id: '9',
        question: 'How do I compare products?',
        answer: 'Use our product comparison tool to compare specifications and prices side by side.',
      },
    ],
  },
  {
    id: '4',
    name: 'Account & Profile',
    icon: 'user',
    questions: [
      {
        id: '10',
        question: 'How do I create an account?',
        answer: 'Sign up using your email or social media account. It only takes a few minutes.',
      },
      {
        id: '11',
        question: 'Can I change my password?',
        answer: 'Yes, you can change your password in your account settings.',
      },
      {
        id: '12',
        question: 'How do I update my profile?',
        answer: 'You can update your profile information in your account settings.',
      },
    ],
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeQuestion, setActiveQuestion] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-500">
          Find answers to common questions about orders, shipping, payments, and more
        </p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-6 py-4 text-sm rounded-lg transition-all",
                activeCategory === category.id
                  ? "bg-[#232F3E] text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#232F3E]/10 mb-2">
                <svg
                  className="w-5 h-5 text-[#232F3E]"
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
              <h3 className="font-medium">{category.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Questions */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "bg-white rounded-lg shadow-sm",
              activeCategory !== category.id && "opacity-50"
            )}
          >
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                {category.name}
              </h2>
              <div className="space-y-4">
                {category.questions.map((question) => (
                  <div
                    key={question.id}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <button
                      onClick={() =>
                        setActiveQuestion(
                          activeQuestion === question.id ? '' : question.id
                        )
                      }
                      className="flex justify-between items-center w-full p-4 text-left text-gray-900 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-lg font-medium">
                        {question.question}
                      </span>
                      <svg
                        className={cn(
                          "w-5 h-5 transition-transform",
                          activeQuestion === question.id
                            ? "rotate-180 transform"
                            : ""
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {activeQuestion === question.id && (
                      <div className="p-4 text-gray-600">
                        {question.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Support */}
      <div className="mt-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Still Need Help?
          </h3>
          <div className="space-y-4">
            <button
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#232F3E] hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232F3E]"
            >
              Contact Support
            </button>
            <div className="text-sm text-gray-500">
              Our support team is available 24/7 to help you with any questions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
