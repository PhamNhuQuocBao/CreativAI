import { APIs } from '@/config'

export interface ModerationFlag {
  isInappropriate: boolean
  reasons: string[]
  severity: 'low' | 'medium' | 'high'
  explanation: string
  reviewedBy?: string
  reviewedAt?: Date
}

export interface FlaggedBlog {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  moderation: ModerationFlag
}

export interface ReviewAction {
  action: 'approve' | 'reject'
  reason?: string
}

export const adminService = {
  getFlaggedBlogs: async () => {
    const { data } = await APIs.get<FlaggedBlog[]>('/admin/flagged-blogs')
    return data
  },

  reviewBlog: async (blogId: string, reviewData: ReviewAction) => {
    const { data } = await APIs.post<FlaggedBlog>(
      `/admin/blogs/${blogId}/review`,
      reviewData
    )
    return data
  },
}
