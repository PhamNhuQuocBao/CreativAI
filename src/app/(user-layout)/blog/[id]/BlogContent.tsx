'use client'

import React from 'react'
import { useBlog } from '@/hooks'
import BlogDetailSkeleton from '@/app/components/common/BlogDetailSkeleton'
import ErrorMessage from '@/app/components/common/ErrorMessage'

const BlogContent = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useBlog(id)

  if (isLoading) return <BlogDetailSkeleton />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <div>No blog found</div>

  return (
    <div className="bg-white py-4 px-6 rounded-lg">
      <h1 className="text-4xl font-bold mb-6">{data.title}</h1>

      <div className="flex gap-2 mb-6">
        {data.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  )
}

export default BlogContent
