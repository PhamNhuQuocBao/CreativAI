import { APIs } from '@/config'

export interface PostsOverTimeData {
  _id: {
    year: number
    month: number
    day?: number
  }
  count: number
}

export interface CommentsPerPostData {
  blogTitle: string
  commentCount: number
}

export interface ReactionDistributionData {
  like: number
  love: number
  wow: number
  angry: number
  dislike: number
}

export interface InteractionsOverTimeData {
  _id: {
    year: number
    month: number
    day?: number
  }
  totalInteractions: number
}

export interface TopEngagedPostData {
  title: string
  totalEngagement: number
}

export const statisticsService = {
  getPostsOverTime: async (
    interval: 'day' | 'month' = 'day',
    startDate?: string,
    endDate?: string
  ) => {
    const params = new URLSearchParams()
    if (interval) params.append('interval', interval)
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const { data } = await APIs.get<PostsOverTimeData[]>(
      `/statistics/posts-over-time?${params}`
    )
    return data
  },

  getCommentsPerPost: async (limit: number = 10) => {
    const { data } = await APIs.get<CommentsPerPostData[]>(
      `/statistics/comments-per-post?limit=${limit}`
    )
    return data
  },

  getReactionDistribution: async () => {
    const { data } = await APIs.get<ReactionDistributionData>(
      '/statistics/reaction-distribution'
    )
    return data
  },

  getInteractionsOverTime: async (
    interval: 'day' | 'month' = 'day',
    startDate?: string,
    endDate?: string
  ) => {
    const params = new URLSearchParams()
    if (interval) params.append('interval', interval)
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const { data } = await APIs.get<InteractionsOverTimeData[]>(
      `/statistics/interactions-over-time?${params}`
    )
    return data
  },

  getTopEngagedPosts: async (limit: number = 10) => {
    const { data } = await APIs.get<TopEngagedPostData[]>(
      `/statistics/top-engaged-posts?limit=${limit}`
    )
    return data
  },
}
