'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCreateProperty, useProperty, useUpdateProperty } from '@/hooks/useProperties';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function CreatePropertyContent({ propertyId }: { propertyId?: string }) {
  const router = useRouter();
  const { data: property } = useProperty(propertyId || '');
  const { mutate: createProperty, isPending: isCreating } = useCreateProperty();
  const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  useEffect(() => {
    if (property && propertyId) {
      setTitle(property.title);
      setDescription(property.description);
      setLocation(property.location);
      setPrice(property.price.toString());
      setImageUrls(property.images.length > 0 ? property.images : ['']);
    }
  }, [property, propertyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const images = imageUrls.filter((url) => url.trim() !== '');

    if (propertyId) {
      updateProperty({
        id: propertyId,
        data: {
          title,
          description,
          location,
          price: parseFloat(price),
          images,
        },
      });
    } else {
      createProperty({
        title,
        description,
        location,
        price: parseFloat(price),
        images,
      });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageUrls];
    newImages[index] = value;
    setImageUrls(newImages);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageField = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {propertyId ? 'Edit Property' : 'Create New Property'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                placeholder="Property Title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                placeholder="Detailed description of the property..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                placeholder="Property Location"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            {/* Image URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (URLs)
              </label>
              <div className="space-y-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Add Another Image
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : propertyId ? 'Update Property' : 'Create Property'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreatePropertyPage({ params }: { params?: { id?: string } }) {
  return (
    <ProtectedRoute>
      <CreatePropertyContent propertyId={params?.id} />
    </ProtectedRoute>
  );
}
