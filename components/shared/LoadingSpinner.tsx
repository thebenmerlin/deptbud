// components/shared/LoadingSpinner.tsx

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
    </div>
  );
}
