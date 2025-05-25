import { UserType } from './user'

interface AIGenerated {
  content: string
  images: string[]
  modelUsed: string
  prompt: string
  _id: string
}

interface ReactionCounts {
  like: number
  love: number
  wow: number
  angry: number
  dislike: number
  _id: string
}

interface Rating {
  userId: string
  score: number
  comment?: string
  createdAt: string
}

export interface BlogResponseType {
  _id: string
  title: string
  slug: string
  content: string
  authorId: UserType
  status: 'draft' | 'published'
  tags: string[]
  aiGenerated: AIGenerated
  views: number
  ratings: Rating[]
  reactionCounts: ReactionCounts
  createdAt: string
  updatedAt: string
}
