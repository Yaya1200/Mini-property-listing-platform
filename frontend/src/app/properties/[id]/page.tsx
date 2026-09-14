"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Contact message starts empty
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(`/properties/${id}`);

        setProperty(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleContactOwner = async () => {
    if (!message.trim()) {
      setContactMessage("Please enter a message.");
      return;
    }

    try {
      setSending(true);
      setContactMessage("");

      await apiClient.post(`/properties/${id}/contact`, {
        message: message.trim(),
      });

      setContactMessage("Message sent to the property owner.");

      // Reset textarea after successful sending
      setMessage("");
    } catch (err: any) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        router.push("/login");
        return;
      }

      console.error(err);

      setContactMessage(
        err.response?.data?.message ||
          "Failed to contact the property owner."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Property not found
          </h2>

          <p className="mt-2 text-gray-600">
            {error || "This property could not be found."}
          </p>

          <Link
            href="/properties"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/properties"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Properties
        </Link>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* PROPERTY IMAGES */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {property.images?.length > 0 ? (
              property.images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${property.title} image ${index + 1}`}
                  className="h-80 w-full object-cover"
                />
              ))
            ) : (
              <div className="flex h-80 items-center justify-center bg-gray-200 text-gray-500 md:col-span-2">
                No images available
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {/* TITLE / PRICE / STATUS */}
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      property.status === "published"
                        ? "bg-green-100 text-green-700"
                        : property.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  📍 {property.location}
                </p>
              </div>

              <p className="text-2xl font-bold text-blue-600">
                {property.price.toLocaleString()} Birr
              </p>
            </div>

            {/* PROPERTY INFORMATION */}
            <div className="mt-8 grid grid-cols-1 gap-4 border-y py-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Location</p>

                <p className="mt-1 font-medium text-gray-900">
                  {property.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Price</p>

                <p className="mt-1 font-medium text-gray-900">
                  {property.price.toLocaleString()} Birr
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Images</p>

                <p className="mt-1 font-medium text-gray-900">
                  {property.images.length}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                {property.description}
              </p>
            </div>

            {/* CONTACT OWNER */}
            {property.status === "published" && (
              <div className="mt-10 border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Owner
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Interested in this property? Send a message
                  to the property owner.
                </p>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your message..."
                  className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  onClick={handleContactOwner}
                  disabled={sending}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Contact Owner"}
                </button>

                {contactMessage && (
                  <p className="mt-3 text-sm text-gray-600">
                    {contactMessage}
                  </p>
                )}
              </div>
            )}

            {/* PROPERTY STATUS MESSAGE */}
            {property.status !== "published" && (
              <div className="mt-10 rounded-lg bg-gray-100 p-4">
                <p className="text-sm text-gray-600">
                  This property is currently{" "}
                  <strong>{property.status}</strong> and is
                  not available for public contact.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

