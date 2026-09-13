'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PropertyCard } from '@/components/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

function UserDashboardContent() {
  const [page, setPage] = useState(1);
  const limit = 12;
  
  const { data, isLoading, error } = useFavorites(page, limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">Error loading favorites</p>
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">You haven't added any favorites yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.data.map((favorite) => (
                <PropertyCard 
                  key={favorite.id} 
                  property={favorite.properties!} 
                />
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {data.pages}
                </span>
                <button
                  onClick={() => setPage(Math.min(data.pages, page + 1))}
                  disabled={page === data.pages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <UserDashboardContent />
    </ProtectedRoute>
  );
}
