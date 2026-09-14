"use client";

import { useEffect } from "react";

export default function Error({
error,
reset,
}: {
error: Error & { digest?: string };
reset: () => void;
}) {
useEffect(() => {
console.error(error);
}, [error]);

return ( <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6"> <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm"> <h2 className="text-2xl font-semibold text-gray-900">
Owner dashboard error </h2>

    <p className="mt-3 text-sm text-gray-600">
      We couldn&apos;t load your owner dashboard. Please try again.
    </p>

    <button
      onClick={() => reset()}
      className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
    >
      Try again
    </button>
  </div>
</main>


);
}
