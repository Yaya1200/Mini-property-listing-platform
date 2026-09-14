"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PropertyCard } from "@/components/PropertyCard";
import { useFavorites } from "@/hooks/useFavorites";
import apiClient from "@/lib/api-client";
import { Property } from "@/services/properties.service";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const fetchPublishedProperties = async (
  page: number,
  limit: number,
) => {
  const response = await apiClient.get("/properties", {
    params: {
      page,
      limit,
      status: "published",
    },
  });

  return response.data;
};

function UserDashboardContent() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useQuery({
    queryKey: ["published-properties", page, limit],
    queryFn: () => fetchPublishedProperties(page, limit),
    staleTime: 3 * 60 * 1000,
  });

  const {
    data: favoritesData,
    isLoading: favoritesLoading,
  } = useFavorites(1, 5);

  const properties: Property[] = propertiesData?.data ?? [];
  const totalPages = propertiesData?.pages ?? 1;

  const favorites = favoritesData?.data ?? [];

  const isLoading = propertiesLoading || favoritesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border bg-white"
              >
                <div className="h-48 bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (propertiesError) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-semibold text-red-800">
            Unable to load properties
          </h2>

          <p className="mt-2 text-sm text-red-700">
            Something went wrong while loading published properties.
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Find your next property
          </h1>

          <p className="mt-2 text-gray-600">
            Browse published properties, save your favorites, and
            contact property owners.
          </p>
        </div>

        {/* Quick navigation */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="#properties"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Browse Properties
          </Link>

          <Link
            href="#favorites"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            My Favorites
          </Link>
        </div>

        {/* Favorites preview */}
        <section id="favorites" className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Favorites
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Properties you saved for later.
              </p>
            </div>

            {favorites.length > 0 && (
              <span className="text-sm font-medium text-gray-600">
                {favorites.length} saved
              </span>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="rounded-xl border bg-white px-6 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-2xl">♡</span>
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No favorites yet
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Click the heart on a property below to save it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((favorite) => (
                <PropertyCard
                  key={favorite.id}
                  property={favorite.properties ?? favorite}
                />
              ))}
            </div>
          )}
        </section>

        {/* Published properties */}
        <section id="properties">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Published Properties
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Explore properties currently available on the platform.
            </p>
          </div>

          {properties.length === 0 ? (
            <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                No published properties
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                There are currently no published properties available.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setPage((currentPage) =>
                        Math.max(1, currentPage - 1),
                      )
                    }
                    disabled={page === 1}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setPage((currentPage) =>
                        Math.min(totalPages, currentPage + 1),
                      )
                    }
                    disabled={page === totalPages}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute>
      {user?.role === "regular_user" ? (
        <UserDashboardContent />
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Access denied
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              This dashboard is available only to regular users.
            </p>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
