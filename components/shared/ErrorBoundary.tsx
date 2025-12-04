// components/shared/ErrorBoundary.tsx

"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (err: Error) => {
    setHasError(true);
    setError(err);
  };

  if (hasError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Something went wrong
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setError(null);
              }}
              className="mt-3 inline-flex items-center rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}