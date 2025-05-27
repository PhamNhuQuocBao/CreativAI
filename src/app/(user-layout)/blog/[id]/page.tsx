import React, { Suspense } from 'react'
import BlogContent from './BlogContent'

const LoadingFallback = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
)

const Page = async ({ params }: { params: { id: string } }) => {
  return (
    <div className="container mx-auto py-8 relative">
      <Suspense fallback={<LoadingFallback />}>
        <BlogContent id={params.id} />
      </Suspense>
    </div>
  )
}

export default Page
