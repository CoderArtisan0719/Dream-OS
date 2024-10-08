export function SkeletonLoader() {
  return (
    <div className="mx-auto flex h-[495px] w-[560px] max-w-[560px] animate-pulse flex-col justify-between space-y-4 rounded-lg bg-white p-4 shadow-lg">
      {/* Logo Placeholder */}
      <div className="flex w-full justify-center">
        <div className="h-16 w-16 rounded-md bg-gray-200"></div>
      </div>

      {/* Title Placeholder */}
      <div className="mx-auto h-4 w-3/4 rounded bg-gray-200"></div>

      {/* Social Login Icons Placeholder */}
      <div className="mt-4 flex justify-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
      </div>

      {/* Divider Placeholder */}
      <div className="my-4 flex items-center space-x-2">
        <div className="h-px w-full bg-gray-200"></div>
        <div className="text-xs text-gray-400">or</div>
        <div className="h-px w-full bg-gray-200"></div>
      </div>

      {/* Input Field Placeholder */}
      <div className="h-10 rounded-lg bg-gray-200"></div>

      {/* Button Placeholder */}
      <div className="h-10 rounded-lg bg-gray-200"></div>

      {/* Footer Placeholder */}
      <div className="mx-auto h-4 w-2/3 rounded bg-gray-200"></div>
      <div className="mx-auto h-4 w-1/3 rounded bg-gray-200"></div>
    </div>
  );
}
