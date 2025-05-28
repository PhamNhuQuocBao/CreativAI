import { APIs } from '@/config'
import { BlogResponseType } from '@/types/blog'
import { ENDPOINTS } from '@/constants'

export type BlogCreateInput = {
  title: string
  content: string
  tags: string[]
  status: 'draft' | 'published' | 'pending_review' | 'rejected'
  aiGenerated?: {
    content?: string
    images?: string[]
    modelUsed?: string
    prompt?: string
  }
}

export type BlogUpdateInput = Partial<BlogCreateInput>

export const blogService = {
  getAllBlogs: async (): Promise<BlogResponseType[]> => {
    const response = await APIs.get(ENDPOINTS.BLOGS)
    return response.data
  },

  getDraftBlogs: async (): Promise<BlogResponseType[]> => {
    const response = await APIs.get(`${ENDPOINTS.BLOGS}/drafts`)
    return response.data
  },

  getPublishedBlogs: async (): Promise<BlogResponseType[]> => {
    const response = await APIs.get(`${ENDPOINTS.BLOGS}/published`)
    return response.data
  },

  getBlogById: async (id: string): Promise<BlogResponseType> => {
    const response = await APIs.get(`${ENDPOINTS.BLOGS}/${id}`)
    return response.data
  },

  createBlog: async (data: BlogCreateInput): Promise<BlogResponseType> => {
    const response = await APIs.post(ENDPOINTS.BLOGS, data)
    return response.data
  },

  updateBlog: async (
    id: string,
    data: BlogUpdateInput
  ): Promise<BlogResponseType> => {
    const response = await APIs.put(`${ENDPOINTS.BLOGS}/${id}`, data)
    return response.data
  },

  deleteBlog: async (id: string): Promise<void> => {
    await APIs.delete(`${ENDPOINTS.BLOGS}/${id}`)
  },
}
