'use client';

import { useAddFavorite, useRemoveFavorite, useIsFavorite } from '@/hooks/useFavorites';
import { Property } from '@/services/properties.service';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { data: favorite } = useIsFavorite(property.id);
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const isFavorited = favorite?.isFavorite || false;
  const isLoadingFavorite = isAdding || isRemoving;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorited) {
      removeFavorite(property.id);
    } else {
      addFavorite(property.id);
    }
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image container */}
        <div className="relative h-48 bg-gray-200">
          {property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image
            </div>
          )}
          <button
            onClick={handleToggleFavorite}
            disabled={isLoadingFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className={`text-xl ${isFavorited ? '❤️' : '🤍'}`}>
              {isFavorited ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg truncate text-gray-900">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{property.location}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {property.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              {property.price.toLocaleString()} Birr
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {property.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
