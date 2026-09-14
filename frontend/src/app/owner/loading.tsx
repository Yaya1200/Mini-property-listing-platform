export default function Loading() {
return ( <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl animate-pulse"> <div className="mb-8 flex items-center justify-between"> <div> <div className="h-8 w-56 rounded bg-gray-200" /> <div className="mt-3 h-4 w-72 rounded bg-gray-200" /> </div>

      <div className="h-11 w-40 rounded-lg bg-gray-200" />
    </div>

    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-28 rounded-xl border bg-white p-5"
        >
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-4 h-8 w-12 rounded bg-gray-200" />
        </div>
      ))}
    </div>

    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="border-b p-6">
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
