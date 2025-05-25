'use client'

import BlogCard from '@/app/components/common/BlogCard'
import BlogCardSkeleton from '@/app/components/common/BlogCardSkeleton'
import ErrorMessage from '@/app/components/common/ErrorMessage'
import { useBlogs } from '@/hooks'
import { useRouter } from 'next/navigation'
import React from 'react'

const LoadingState = () => (
  <div className="flex flex-col gap-4">
    {[...Array(3)].map((_, index) => (
      <BlogCardSkeleton key={index} />
    ))}
  </div>
)

const Page = () => {
  const router = useRouter()
  const { data, isLoading, error } = useBlogs()

  if (isLoading) return <LoadingState />
  if (error) return <ErrorMessage error={error} />

  return (
    <div className="flex flex-col gap-4">
      {data?.map((blog) => (
        <BlogCard
          key={blog._id}
          data={blog}
          onClick={() => router.push(`/blog/${blog._id}`)}
        />
      ))}
    </div>
  )
}

export default Page
