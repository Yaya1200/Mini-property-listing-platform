"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertiesService } from "@/services/properties.service";

interface Property {
id: string;
title: string;
description: string;
location: string;
price: number;
status: "draft" | "published" | "archived";
images: string[];
}

export default function EditPropertyPage() {
const params = useParams();
const router = useRouter();

const propertyId = params.id as string;

const [property, setProperty] = useState<Property | null>(null);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");
const [price, setPrice] = useState("");
const [images, setImages] = useState("");
const [isUploading, setIsUploading] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState("");

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  setError("");
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!allowedMimeTypes.includes(file.type)) {
      setError(`Invalid image format for "${file.name}". Only JPEG, PNG, and WebP images are allowed.`);
      return;
    }
    if (file.size > maxFileSize) {
      setError(`File "${file.name}" exceeds the 5MB size limit.`);
      return;
    }
  }

  setIsUploading(true);
  try {
    const uploadedUrls = await propertiesService.uploadImages(Array.from(files));
    setImages((prev) => {
      const existing = prev ? prev.trim().split("\n").filter(Boolean) : [];
      return [...existing, ...uploadedUrls].join("\n");
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    setError(
      err?.response?.data?.message ||
        "Failed to upload image to cloud storage. Please try again or provide an external URL."
    );
  } finally {
    setIsUploading(false);
    event.target.value = "";
  }
};

useEffect(() => {
  const fetchProperty = async () => {
    if (!propertyId) return;
    try {
      setIsLoading(true);
      const data = await propertiesService.getProperty(propertyId);
      setProperty(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setLocation(data.location || "");
      setPrice(String(data.price || ""));
      setImages((data.images || []).join("\n"));
    } catch (err) {
      console.error("Failed to load property:", err);
      setError("Failed to load property details.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchProperty();
}, [propertyId]);

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();

setError("");

const numericPrice = Number(price);

if (!title.trim()) {
  setError("Title is required.");
  return;
}

if (!description.trim()) {
  setError("Description is required.");
  return;
}

if (!location.trim()) {
  setError("Location is required.");
  return;
}

if (!numericPrice || numericPrice <= 0) {
  setError("Price must be greater than 0.");
  return;
}

const imageUrls = images
  .split("\n")
  .map((image) => image.trim())
  .filter(Boolean);

for (const url of imageUrls) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setError(`Invalid image URL protocol: "${url}". Only HTTP and HTTPS URLs are allowed.`);
      return;
    }
  } catch {
    setError(`Invalid image URL format: "${url}"`);
    return;
  }
}

setIsSaving(true);

try {
  await propertiesService.updateProperty(propertyId, {
    title,
    description,
    location,
    price: numericPrice,
    images: imageUrls,
  });

  router.push("/owner");
} catch (err: any) {
  console.error("Failed to save changes:", err);
  setError(err?.response?.data?.message || "Failed to save changes. Please try again.");
} finally {
  setIsSaving(false);
}


};

if (isLoading) {
return ( <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl animate-pulse"> <div className="h-4 w-32 rounded bg-gray-200" /> <div className="mt-6 h-8 w-56 rounded bg-gray-200" /> <div className="mt-8 h-[600px] rounded-xl bg-gray-200" /> </div> </main>
);
}

if (!property) {
return ( <main className="flex min-h-[70vh] items-center justify-center px-6"> <div className="text-center"> <h2 className="text-xl font-semibold text-gray-900">
Property not found </h2>


      <Link
        href="/owner"
        className="mt-4 inline-block text-sm font-medium underline"
      >
        Back to dashboard
      </Link>
    </div>
  </main>
);

}

if (property.status !== "draft") {
return ( <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6"> <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-sm"> <h2 className="text-xl font-semibold text-gray-900">
Property cannot be edited </h2>


      <p className="mt-3 text-sm text-gray-600">
        Only draft properties can be edited. This property is
        currently {property.status}.
      </p>

      <Link
        href="/owner"
        className="mt-6 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
      >
        Back to dashboard
      </Link>
    </div>
  </main>
);


}

return ( <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl"> <div className="mb-8"> <Link
         href="/owner"
         className="text-sm font-medium text-gray-600 hover:text-gray-900"
       >
← Back to dashboard </Link>


      <h1 className="mt-5 text-3xl font-bold text-gray-900">
        Edit Property
      </h1>

      <p className="mt-2 text-gray-600">
        Update your draft property before publishing it.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm sm:p-8"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={6}
          className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Location
        </label>

        <input
          id="location"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Price
        </label>

        <div className="relative">
          <input
            id="price"
            type="number"
            min="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full rounded-lg border px-4 py-3 pr-16 outline-none focus:border-black"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ETB
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="images"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Property Images (Cloud Upload or External URLs)
        </label>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <span>{isUploading ? "Uploading to Cloud..." : "📁 Upload Image from Device (Max 5MB)"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-xs text-gray-500">
            Allowed: JPG, PNG, WebP up to 5MB. Stored in Cloud Storage.
          </span>
        </div>

        <textarea
          id="images"
          value={images}
          onChange={(event) => setImages(event.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-black"
        />

        <p className="mt-2 text-xs text-gray-500">
          Upload images using the button above or paste external image URLs (one per line). All URLs are validated and optimized for production.
        </p>

        {images.trim() && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images
              .split("\n")
              .map((img) => img.trim())
              .filter(Boolean)
              .map((imgUrl, idx) => (
                <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-lg border bg-gray-100">
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23fee2e2' width='64' height='64'/%3E%3Ctext fill='%23ef4444' font-size='10' x='50%25' y='50%25' text-anchor='middle' dy='3'%3EInvalid%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/owner"
          className="rounded-lg border px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  </div>
</main>


);
}
