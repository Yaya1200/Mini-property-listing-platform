'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { useOwnerProperties, useCreateProperty, useDeleteProperty, usePublishProperty } from '@/hooks/useProperties';
import Link from 'next/link';
import { useState } from 'react';

function OwnerDashboardContent() {
  const { data: user } = useCurrentUser();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: properties, isLoading, error } = useOwnerProperties(user?.id as string || '', page, limit);
  const { mutate: deleteProperty } = useDeleteProperty();
  const { mutate: publishProperty } = usePublishProperty();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <Link
            href="/properties/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Property
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading your properties...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">Error loading properties</p>
          </div>
        ) : !properties || properties.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any properties yet</p>
            <Link
              href="/properties/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Property
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.data.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {property.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            property.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {property.status === 'draft' && (
                          <>
                            <Link
                              href={`/properties/${property.id}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => publishProperty(property.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Publish
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {properties.pages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {properties.pages}
                </span>
                <button
                  onClick={() => setPage(Math.min(properties.pages, page + 1))}
                  disabled={page === properties.pages}
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

export default function OwnerDashboardPage() {
  return (
    <ProtectedRoute>
      <OwnerDashboardContent />
    </ProtectedRoute>
  );
}
