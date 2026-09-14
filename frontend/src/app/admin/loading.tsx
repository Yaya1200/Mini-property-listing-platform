export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
        </div>

        {/* Metrics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="mt-3 h-9 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Properties */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-64 rounded bg-gray-200" />
          </div>

          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

