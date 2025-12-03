export default function Loading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
      </div>
    </div>
  );
}
