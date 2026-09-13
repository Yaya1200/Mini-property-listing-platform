'use client';

import { useProperty } from '@/hooks/useProperties';
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from '@/hooks/useFavorites';
import Image from 'next/image';

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const { data: property, isLoading, error } = useProperty(params.id);
  const { data: favorite } = useIsFavorite(params.id);
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Property not found</p>
      </div>
    );
  }

  const isFavorited = favorite?.isFavorite || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          {property.images.length > 0 ? (
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No image available</p>
            </div>
          )}

          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {property.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative h-20 bg-gray-200 rounded">
                  <Image
                    src={image}
                    alt={`${property.title} ${index}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <p className="text-lg text-gray-600">{property.location}</p>
            </div>
            <button
              onClick={() => {
                if (isFavorited) {
                  removeFavorite(property.id);
                } else {
                  addFavorite(property.id);
                }
              }}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className={`text-3xl ${isFavorited ? '❤️' : '🤍'}`}>
                {isFavorited ? '❤️' : '🤍'}
              </span>
            </button>
          </div>

          <div className="mb-8">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              ${property.price.toLocaleString()}
            </p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {property.status}
            </span>
          </div>

          <div className="border-t border-b py-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Created</p>
              <p className="text-gray-900 font-semibold">
                {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Last Updated</p>
              <p className="text-gray-900 font-semibold">
                {new Date(property.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
}
