'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PropertyHub</div>
          <div className="space-x-4">
            <Link href="/properties" className="text-gray-700 hover:text-gray-900">
              Browse
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Property
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing properties from trusted owners. List your property or find your next home.
          </p>
          <div className="space-x-4">
            <Link
              href="/properties"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
            >
              Browse Properties
            </Link>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 text-lg font-semibold"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose PropertyHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-600">
                Browse thousands of properties available for sale or rent.
              </p>
            </div>
            <div className="p-8 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure & Verified
              </h3>
              <p className="text-gray-600">
                All property listings are verified and secure.
              </p>
            </div>
            <div className="p-8 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Easy Communication
              </h3>
              <p className="text-gray-600">
                Connect directly with property owners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 text-lg font-semibold"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
