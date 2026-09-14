"use client";

import { useState } from "react";

type PropertyStatus = "draft" | "published" | "archived";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  owner: string;
  status: PropertyStatus;
};

const initialProperties: Property[] = [
  {
    id: 1,
    title: "Modern Apartment",
    location: "Bole, Addis Ababa",
    price: 85000,
    owner: "Abebe Kebede",
    status: "published",
  },
  {
    id: 2,
    title: "Family House",
    location: "Kazanchis, Addis Ababa",
    price: 150000,
    owner: "Sara Ahmed",
    status: "published",
  },
  {
    id: 3,
    title: "Two Bedroom Apartment",
    location: "CMC, Addis Ababa",
    price: 65000,
    owner: "Dawit Tesfaye",
    status: "draft",
  },
  {
    id: 4,
    title: "Luxury Villa",
    location: "Old Airport, Addis Ababa",
    price: 250000,
    owner: "Hana Bekele",
    status: "archived",
  },
];

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>(
    initialProperties
  );

  const totalProperties = properties.length;

  const publishedProperties = properties.filter(
    (property) => property.status === "published"
  ).length;

  const draftProperties = properties.filter(
    (property) => property.status === "draft"
  ).length;

  const archivedProperties = properties.filter(
    (property) => property.status === "archived"
  ).length;

  const handleDisableProperty = (id: number) => {
    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property.id === id
          ? { ...property, status: "archived" }
          : property
      )
    );
  };

  const getStatusClass = (status: PropertyStatus) => {
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

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage properties and monitor the platform.
          </p>
        </div>

        {/* Metrics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Properties
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalProperties}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {publishedProperties}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {draftProperties}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Archived
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-600">
              {archivedProperties}
            </p>
          </div>
        </div>

        {/* Properties */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              All Properties
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage properties on the platform.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Property
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Owner
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {property.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          {property.location}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {property.owner}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {property.price.toLocaleString()} ETB
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {property.status === "published" ? (
                        <button
                          onClick={() =>
                            handleDisableProperty(property.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Disable
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-200 md:hidden">
            {properties.map((property) => (
              <div key={property.id} className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {property.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {property.location}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    Owner:{" "}
                    <span className="font-medium text-gray-900">
                      {property.owner}
                    </span>
                  </p>

                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="font-medium text-gray-900">
                      {property.price.toLocaleString()} ETB
                    </span>
                  </p>
                </div>

                {property.status === "published" && (
                  <button
                    onClick={() => handleDisableProperty(property.id)}
                    className="mt-4 w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Disable Property
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

