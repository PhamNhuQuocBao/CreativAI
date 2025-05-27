import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BlogResponseType } from '@/types/blog'
import { useCommentCount, useLatestComments } from '@/hooks/use-comment'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'

interface BlogCardProps {
  data: BlogResponseType
  onClick?: () => void
  className?: string
}

const BlogCard = ({ data, onClick, className }: BlogCardProps) => {
  const { count: commentCount } = useCommentCount(data._id)
  const { comments } = useLatestComments(data._id)

  return (
    <Card
      className={cn('w-full cursor-pointer hover:bg-gray-50', className)}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={data.authorId.avatar || 'https://github.com/shadcn.png'}
            />
          </Avatar>
          <div>
            <CardTitle>{data.authorId.name || 'Anonymous'}</CardTitle>
            <CardDescription>
              {new Date(data.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold px-10">{data.title}</h2>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <div className="flex items-center justify-between w-full px-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <span>{data.reactionCounts.like}</span>
                  <span>👍</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <span>{data.reactionCounts.love}</span>
                  <span>❤️</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <span>{data.reactionCounts.wow}</span>
                  <span>😮</span>
                </Button>
              </div>
              <div className="h-4 w-[1px] bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {commentCount} comments
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {data.views} views
                </span>
              </div>
            </div>
          </div>

          {/* Latest Comments */}
          <div>
            {comments && comments.length > 0 && (
              <div className="w-full px-10 space-y-3">
                <div className="h-[1px] bg-gray-100 w-full" />
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={
                          comment.userId.avatar ||
                          'https://github.com/shadcn.png'
                        }
                      />
                    </Avatar>
                    <div className="flex-1 bg-gray-100 rounded-md py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.userId.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlogCard
