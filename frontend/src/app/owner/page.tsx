"use client";

import Link from "next/link";
import { useState } from "react";

type PropertyStatus = "draft" | "published" | "archived";

interface Property {
id: string;
title: string;
description: string;
location: string;
price: number;
status: PropertyStatus;
images: string[];
createdAt: string;
updatedAt: string;
}

const initialProperties: Property[] = [
{
id: "1",
title: "Modern Apartment",
description: "A comfortable modern apartment.",
location: "Addis Ababa",
price: 25000,
status: "published",
images: [],
createdAt: "2026-09-01",
updatedAt: "2026-09-01",
},
{
id: "2",
title: "Family House",
description: "Spacious family house.",
location: "Bole",
price: 45000,
status: "draft",
images: [],
createdAt: "2026-09-05",
updatedAt: "2026-09-05",
},
];

export default function OwnerPage() {
const [properties, setProperties] =
useState<Property[]>(initialProperties);

const [isPublishing, setIsPublishing] = useState<string | null>(null);
const [isDeleting, setIsDeleting] = useState<string | null>(null);

const publishedCount = properties.filter(
(property) => property.status === "published",
).length;

const draftCount = properties.filter(
(property) => property.status === "draft",
).length;

const archivedCount = properties.filter(
(property) => property.status === "archived",
).length;

const handlePublish = async (propertyId: string) => {
setIsPublishing(propertyId);


try {
  // We will connect this to:
  // POST /properties/:id/publish

  setProperties((current) =>
    current.map((property) =>
      property.id === propertyId
        ? {
            ...property,
            status: "published",
            updatedAt: new Date().toISOString(),
          }
        : property,
    ),
  );
} finally {
  setIsPublishing(null);
}


};

const handleDelete = async (propertyId: string) => {
const confirmed = window.confirm(
"Are you sure you want to delete this property?",
);


if (!confirmed) {
  return;
}

setIsDeleting(propertyId);

try {
  // We will connect this to:
  // DELETE /properties/:id

  setProperties((current) =>
    current.filter((property) => property.id !== propertyId),
  );
} finally {
  setIsDeleting(null);
}


};

const getStatusClasses = (status: PropertyStatus) => {
switch (status) {
case "published":
return "bg-green-100 text-green-700";
case "draft":
return "bg-yellow-100 text-yellow-700";
case "archived":
return "bg-gray-100 text-gray-700";
default:
return "bg-gray-100 text-gray-700";
}
};

return ( <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl">
{/* Header */} <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <h1 className="text-3xl font-bold text-gray-900">
Owner Dashboard </h1>

        <p className="mt-1 text-gray-600">
          Manage your property listings.
        </p>
      </div>

      <Link
        href="/owner/create"
        className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        + Create Property
      </Link>
    </div>

    {/* Stats */}
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Properties</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {properties.length}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Published</p>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {publishedCount}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Drafts</p>
        <p className="mt-2 text-3xl font-bold text-yellow-600">
          {draftCount}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Archived</p>
        <p className="mt-2 text-3xl font-bold text-gray-600">
          {archivedCount}
        </p>
      </div>
    </div>

    {/* Properties */}
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">
          My Properties
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create, edit, publish, and manage your listings.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No properties yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Create your first property listing to get started.
          </p>

          <Link
            href="/owner/create"
            className="mt-5 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Property
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="px-6 py-4 font-medium">Property</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-gray-900">
                          {property.title}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                          {property.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {property.location}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      {property.price.toLocaleString()} ETB
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(
                          property.status,
                        )}`}
                      >
                        {property.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {property.status === "draft" && (
                          <>
                            <Link
                              href={`/owner/properties/${property.id}/edit`}
                              className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handlePublish(property.id)
                              }
                              disabled={isPublishing === property.id}
                              className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isPublishing === property.id
                                ? "Publishing..."
                                : "Publish"}
                            </button>
                          </>
                        )}

                        {property.status !== "published" && (
                          <button
                            onClick={() =>
                              handleDelete(property.id)
                            }
                            disabled={isDeleting === property.id}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting === property.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y md:hidden">
            {properties.map((property) => (
              <div key={property.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {property.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {property.location}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(
                      property.status,
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600">
                  {property.description}
                </p>

                <p className="mt-3 font-semibold text-gray-900">
                  {property.price.toLocaleString()} ETB
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {property.status === "draft" && (
                    <>
                      <Link
                        href={`/owner/properties/${property.id}/edit`}
                        className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handlePublish(property.id)
                        }
                        disabled={isPublishing === property.id}
                        className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        {isPublishing === property.id
                          ? "Publishing..."
                          : "Publish"}
                      </button>
                    </>
                  )}

                  {property.status !== "published" && (
                    <button
                      onClick={() =>
                        handleDelete(property.id)
                      }
                      disabled={isDeleting === property.id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                    >
                      {isDeleting === property.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  </div>
</main>

);
}
