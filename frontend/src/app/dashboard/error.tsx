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

return ( <div className="flex min-h-[60vh] items-center justify-center px-6"> <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm"> <h2 className="text-2xl font-semibold text-gray-900">
Something went wrong </h2>
    <p className="mt-3 text-sm text-gray-600">
      We couldn&apos;t load your dashboard. Please try again.
    </p>

    <button
      onClick={() => reset()}
      className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
    >
      Try again
    </button>
  </div>
</div>
);}
