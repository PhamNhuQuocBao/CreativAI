import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BlogResponseType } from '@/types/blog'
import React from 'react'

interface BlogCardProps {
  data: BlogResponseType
  onClick?: () => void
  className?: string
}

const BlogCard = ({ data, onClick, className }: BlogCardProps) => {
  return (
    <Card className={cn(className, 'cursor-pointer')} onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={data.authorId.avatar || 'https://github.com/shadcn.png'}
            />
          </Avatar>
          <div>
            <p className="font-medium">{data.authorId.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="text-2xl 2xl:text-3xl font-bold px-10">
          {data.title}
        </CardTitle>
        <CardDescription className="px-10">
          <div className="flex items-center gap-2">
            {data.tags.slice(0, 5).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="text-sm text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer transition-all duration-300"
              >
                {`#${tag.replace('#', '')}`}
              </span>
            ))}
            {data.tags.length > 5 && (
              <span className="text-sm text-gray-500">...</span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter>
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
                {data.ratings.length} comments
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{data.views} views</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlogCard
