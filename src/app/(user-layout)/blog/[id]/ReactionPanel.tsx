'use client'

import { cn } from '@/lib/utils'
import { Heart, ThumbsUp, Star, Bookmark, ChevronLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactionCounts } from '@/types/blog'
import { useReaction } from '@/hooks/use-reaction'
import { useRouter } from 'next/navigation'

interface ReactionPanelProps {
  blogId: string
  initialReactionCounts?: ReactionCounts
  className?: string
}

const defaultReactionCounts: ReactionCounts = {
  like: 0,
  love: 0,
  wow: 0,
  angry: 0,
  dislike: 0,
}

const reactionButtons = [
  {
    id: 'like',
    icon: ThumbsUp,
    label: 'Like',
    activeColor: 'text-blue-500',
  },
  {
    id: 'love',
    icon: Heart,
    label: 'Love',
    activeColor: 'text-red-500',
  },
  {
    id: 'wow',
    icon: Star,
    label: 'Wow',
    activeColor: 'text-yellow-500',
  },
]

const actionButtons = [
  {
    id: 'save',
    icon: Bookmark,
    label: 'Save',
  },
  {
    id: 'back',
    icon: ChevronLeftIcon,
    label: 'Back',
  },
]

export function ReactionPanel({
  blogId,
  initialReactionCounts = defaultReactionCounts,
  className,
}: ReactionPanelProps) {
  const router = useRouter()
  const { userReaction, updateReaction } = useReaction(blogId)

  const handleReaction = (type: 'like' | 'love' | 'wow') => {
    updateReaction(type)
  }

  const handleAction = (action: string) => {
    if (action === 'back') {
      router.back()
    }
  }

  // Use the latest reaction counts from the API response, fallback to initial counts
  const currentReactionCounts =
    userReaction?.reactionCounts || initialReactionCounts

  return (
    <div
      className={cn('bg-white rounded-lg shadow-lg p-3 space-y-6', className)}
    >
      {/* Reactions */}
      <div className="space-y-4">
        {reactionButtons.map((button) => {
          const isActive =
            userReaction?.userReaction?.reactionType === button.id
          return (
            <div key={button.id} className="text-center">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'rounded-full hover:bg-gray-100 transition-colors',
                  isActive && button.activeColor
                )}
                onClick={() =>
                  handleReaction(button.id as 'like' | 'love' | 'wow')
                }
              >
                <button.icon
                  className={cn('h-5 w-5', isActive && button.activeColor)}
                />
              </Button>
              <div className="text-xs text-gray-500 mt-1">
                {currentReactionCounts[button.id]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 w-full" />

      {/* Actions */}
      <div className="space-y-4">
        {actionButtons.map((button) => (
          <div key={button.id} className="text-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => handleAction(button.id)}
            >
              <button.icon className="h-5 w-5" />
            </Button>
            <div className="text-xs text-gray-500 mt-1">{button.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
