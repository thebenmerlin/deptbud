"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="p-8 min-h-screen flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              System Error
            </h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
