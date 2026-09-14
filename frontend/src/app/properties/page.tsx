"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api-client";

type PropertyStatus = "draft" | "published" | "archived";

interface Property {
id: string;
ownerId: string;
title: string;
description: string;
location: string;
price: number;
images: string[];
status: PropertyStatus;
createdAt: string;
updatedAt: string;
deletedAt: string | null;
}

export default function PropertiesPage() {
const [properties, setProperties] = useState<Property[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchProperties = async () => {
try {
const response = await apiClient.get("/properties", {
params: {
status: "published",
},
});

    setProperties(response.data.data ?? []);
  } catch (err) {
    console.error(err);
    setError("Failed to load properties.");
  } finally {
    setLoading(false);
  }
};

fetchProperties();


}, []);

if (loading) {
return ( <div className="flex min-h-[60vh] items-center justify-center"> <p className="text-gray-600">Loading properties...</p> </div>
);
}

if (error) {
return ( <div className="flex min-h-[60vh] items-center justify-center px-6"> <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"> <p className="text-red-600">{error}</p> </div> </div>
);
}

return ( <main className="min-h-screen bg-gray-50 px-6 py-10"> <div className="mx-auto max-w-7xl"> <div className="mb-8"> <h1 className="text-3xl font-bold text-gray-900">
Properties </h1>

      <p className="mt-2 text-gray-600">
        Browse published properties available on the platform.
      </p>
    </div>

    {properties.length === 0 ? (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-600">
          No published properties available.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Main image */}
            {property.images?.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="h-52 w-full object-cover"
              />
            ) : (
              <div className="flex h-52 items-center justify-center bg-gray-200 text-gray-500">
                No image available
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {property.title}
                </h2>

                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  {property.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                📍 {property.location}
              </p>

              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {property.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold text-blue-600">
                  {property.price.toLocaleString()} Birr
                </p>

                <span className="text-sm font-medium text-blue-600">
                  View details →
                </span>
              </div>

              {property.images.length > 1 && (
                <p className="mt-3 text-xs text-gray-500">
                  {property.images.length} images
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</main>

);
}
