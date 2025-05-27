export const ROUTES = {
  INDEX: '/home',
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  HOME: '/dashboard/home',
  BLOG: '/dashboard/blog',
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
} as const

export const QUERY_KEY = {
  BLOGS: 'blogs',
}
