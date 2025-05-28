export const ROUTES = {
  INDEX: '/home',
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  HOME: '/dashboard/home',
  BLOG: '/dashboard/blog',
  STATISTICS: '/dashboard/statistics',
  MODERATION: '/admin/moderation',
}

export const ENDPOINTS = {
  BLOGS: '/blogs',
  BLOG: (id: string) => `/blogs/${id}`,
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  UPDATE_PROFILE: '/users/update-profile',
  REACTIONS: '/reactions',
  REACTION: (id: string) => `/reactions/${id}`,
  COMMENTS: '/comments',
  COMMENT: (id: string) => `/comments/${id}`,
  STATISTICS: {
    POSTS_OVER_TIME: '/statistics/posts-over-time',
    COMMENTS_PER_POST: '/statistics/comments-per-post',
    REACTION_DISTRIBUTION: '/statistics/reaction-distribution',
    INTERACTIONS_OVER_TIME: '/statistics/interactions-over-time',
    TOP_ENGAGED_POSTS: '/statistics/top-engaged-posts',
  },
} as const

export const QUERY_KEY = {
  BLOGS: 'blogs',
}
