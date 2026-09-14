"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";

type PropertyStatus = "draft" | "published" | "archived";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  ownerId: string;
  status: PropertyStatus;
};

type Metrics = {
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  archivedProperties: number;
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const [metrics, setMetrics] = useState<Metrics>({
    totalProperties: 0,
    publishedProperties: 0,
    draftProperties: 0,
    archivedProperties: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disablingId, setDisablingId] = useState<string | null>(null);

  // ============================================================
  // CALCULATE METRICS FROM PROPERTIES
  // ============================================================

  const calculateMetrics = (
    propertyList: Property[]
  ): Metrics => {
    return {
      totalProperties: propertyList.length,

      publishedProperties: propertyList.filter(
        (property) => property.status === "published"
      ).length,

      draftProperties: propertyList.filter(
        (property) => property.status === "draft"
      ).length,

      archivedProperties: propertyList.filter(
        (property) => property.status === "archived"
      ).length,
    };
  };

  // ============================================================
  // FETCH ADMIN DATA
  // ============================================================

  const fetchAdminData = async () => {
    try {
      setError("");

      // Fetch properties first.
      // This is enough to calculate the dashboard metrics
      // if the separate metrics endpoint is unavailable.
      const propertiesResponse =
        await apiClient.get("/properties/admin/all", {
          params: {
            page: 1,
            limit: 100,
          },
        });

      const propertyList: Property[] =
        propertiesResponse.data?.data ?? [];

      setProperties(propertyList);

      // Calculate metrics from the properties returned by
      // the admin properties endpoint.
      const calculatedMetrics =
        calculateMetrics(propertyList);

      setMetrics(calculatedMetrics);

      // Try to get the official metrics from the backend.
      // If this endpoint fails, we keep the calculated values.
      try {
        const metricsResponse =
          await apiClient.get(
            "/properties/admin/metrics"
          );

        const backendMetrics = metricsResponse.data;

        // Only use backend metrics if all expected values
        // are valid numbers.
        if (
          typeof backendMetrics?.totalProperties ===
            "number" &&
          typeof backendMetrics?.publishedProperties ===
            "number" &&
          typeof backendMetrics?.draftProperties ===
            "number" &&
          typeof backendMetrics?.archivedProperties ===
            "number"
        ) {
          setMetrics(backendMetrics);
        }
      } catch (metricsError) {
        console.warn(
          "Metrics endpoint unavailable. Using calculated metrics.",
          metricsError
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load admin data:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
      } else {
        setError(
          "Failed to load admin dashboard data."
        );
      }
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);

      await fetchAdminData();

      setLoading(false);
    };

    loadAdminData();
  }, []);

  // ============================================================
  // DISABLE PROPERTY
  // ============================================================

  const handleDisableProperty = async (
    id: string
  ) => {
    try {
      setDisablingId(id);

      await apiClient.patch(
        `/properties/admin/${id}/disable`
      );

      // Get fresh data from the backend.
      await fetchAdminData();
    } catch (err: any) {
      console.error(
        "Failed to disable property:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to disable property."
      );
    } finally {
      setDisablingId(null);
    }
  };

  // ============================================================
  // STATUS STYLES
  // ============================================================

  const getStatusClass = (
    status: PropertyStatus
  ) => {
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

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl bg-white shadow-sm"
                />
              )
            )}
          </div>

          <div className="h-96 animate-pulse rounded-xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-semibold text-red-800">
            Unable to load admin dashboard
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={fetchAdminData}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

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

          {/* Total */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Properties
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {metrics.totalProperties}
            </p>
          </div>

          {/* Published */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {metrics.publishedProperties}
            </p>
          </div>

          {/* Drafts */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {metrics.draftProperties}
            </p>
          </div>

          {/* Archived */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Archived
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-600">
              {metrics.archivedProperties}
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

                {properties.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No properties found.
                    </td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-gray-50"
                    >
                      {/* Property */}
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

                      {/* Owner */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {property.ownerId}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {property.price.toLocaleString()} Birr
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            property.status
                          )}`}
                        >
                          {property.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">

                        {property.status ===
                        "published" ? (
                          <button
                            onClick={() =>
                              handleDisableProperty(
                                property.id
                              )
                            }
                            disabled={
                              disablingId ===
                              property.id
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {disablingId ===
                            property.id
                              ? "Disabling..."
                              : "Disable"}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No action
                          </span>
                        )}

                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-200 md:hidden">

            {properties.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No properties found.
              </div>
            ) : (
              properties.map((property) => (
                <div
                  key={property.id}
                  className="p-5"
                >
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
                        {property.ownerId}
                      </span>
                    </p>

                    <p className="text-gray-600">
                      Price:{" "}
                      <span className="font-medium text-gray-900">
                        {property.price.toLocaleString()}{" "}
                        Birr
                      </span>
                    </p>

                  </div>

                  {property.status ===
                    "published" && (
                    <button
                      onClick={() =>
                        handleDisableProperty(
                          property.id
                        )
                      }
                      disabled={
                        disablingId ===
                        property.id
                      }
                      className="mt-4 w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {disablingId === property.id
                        ? "Disabling..."
                        : "Disable Property"}
                    </button>
                  )}
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

