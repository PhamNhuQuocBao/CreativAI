'use client'

import React from 'react'
import { useBlog } from '@/hooks'
import BlogDetailSkeleton from '@/app/components/common/BlogDetailSkeleton'
import ErrorMessage from '@/app/components/common/ErrorMessage'
import { ReactionPanel } from './ReactionPanel'
import { CommentSection } from './CommentSection'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const BlogContent = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useBlog(id)

  if (isLoading) return <BlogDetailSkeleton />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <div>No blog found</div>

  return (
    <div className="flex gap-4">
      <ReactionPanel
        blogId={id}
        initialReactionCounts={data.reactionCounts}
        className="fixed"
      />
      <div className="flex-1 ml-21  mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="self-start mt-4">
            <AvatarImage
              src={data.authorId?.avatar || 'https://github.com/shadcn.png'}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold">
              {data.authorId?.name || 'Anonymous'}
            </h3>
            <p className="text-sm text-gray-500">
              {data.authorId?.bio || 'No bio available'}
            </p>
          </div>
        </div>
        <div className="bg-white py-4 px-6 rounded-lg">
          <h1 className="text-6xl font-bold mb-6">{data.title}</h1>

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

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection blogId={id} />
        </div>
      </div>
    </div>
  )
}

export default BlogContent
