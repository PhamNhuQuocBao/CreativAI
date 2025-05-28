import { APIs } from '@/config'

export interface DashboardOverview {
  totalPosts: number
  totalComments: number
  totalReactions: number
  totalViews: number
}

export interface RecentPost {
  _id: string
  title: string
  createdAt: string
  views: number
  commentCount: number
  totalReactions: number
}

export interface RecentActivity {
  _id: string
  type: 'comment' | 'reaction'
  blogId: string
  blogTitle: string
  userId: string
  userName: string
  createdAt: string
}

export const dashboardService = {
  getOverview: async () => {
    const { data } = await APIs.get<DashboardOverview>('/statistics/overview')
    return data
  },

  getRecentPosts: async (limit: number = 5) => {
    const { data } = await APIs.get<RecentPost[]>(
      `/statistics/recent-posts?limit=${limit}`
    )
    return data
  },

  getRecentActivities: async (limit: number = 10) => {
    const { data } = await APIs.get<RecentActivity[]>(
      `/statistics/recent-activities?limit=${limit}`
    )
    return data
  },
}
