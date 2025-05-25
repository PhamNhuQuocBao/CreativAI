const BlogDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Title */}
      <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-6"></div>

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* AI Generated Content */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>

        {/* Prompt */}
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Model */}
        <div className="h-4 bg-gray-200 rounded w-32"></div>

        {/* Images */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailSkeleton
