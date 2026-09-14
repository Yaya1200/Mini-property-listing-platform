"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePropertyPage() {
const router = useRouter();

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");
const [price, setPrice] = useState("");
const [images, setImages] = useState("");

const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState("");

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

setIsSubmitting(true);

try {
  // We will connect this to:
  // POST /properties

  console.log({
    title,
    description,
    location,
    price: numericPrice,
    images: imageUrls,
  });

  router.push("/owner");
} catch {
  setError("Failed to create property. Please try again.");
} finally {
  setIsSubmitting(false);
}


};

return ( <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl"> <div className="mb-8"> <Link
         href="/owner"
         className="text-sm font-medium text-gray-600 hover:text-gray-900"
       >
← Back to dashboard </Link>


      <h1 className="mt-5 text-3xl font-bold text-gray-900">
        Create Property
      </h1>

      <p className="mt-2 text-gray-600">
        Add a new property listing. New properties start as drafts.
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
          placeholder="Modern apartment in Bole"
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
          placeholder="Describe the property..."
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
          placeholder="Bole, Addis Ababa"
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
            placeholder="25000"
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
          Image URLs
        </label>

        <textarea
          id="images"
          value={images}
          onChange={(event) => setImages(event.target.value)}
          placeholder={
            "https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
          }
          rows={4}
          className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-black"
        />

        <p className="mt-2 text-xs text-gray-500">
          Add one image URL per line. We&apos;ll connect cloud
          image uploads later.
        </p>
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
          disabled={isSubmitting}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Draft"}
        </button>
      </div>
    </form>
  </div>
</main>


);
}
