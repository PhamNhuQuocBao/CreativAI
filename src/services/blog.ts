import { APIs } from '@/config'
import { BlogResponseType } from '@/types/blog'

export const blogService = {
  getAllBlogs: async (): Promise<BlogResponseType[]> => {
    const response = await APIs.get('/blogs')
    return response.data
  },

  getBlogById: async (id: string): Promise<BlogResponseType> => {
    const response = await APIs.get(`/blogs/${id}`)
    return response.data
  },

  createBlog: async (data: {
    title: string
    content: string
    tags: string[]
    aiGenerated?: {
      content?: string
      images?: string[]
      modelUsed?: string
      prompt?: string
    }
  }): Promise<BlogResponseType> => {
    const response = await APIs.post('/blogs', data)
    return response.data
  },

  updateBlog: async (
    id: string,
    data: Partial<BlogResponseType>
  ): Promise<BlogResponseType> => {
    const response = await APIs.put(`/blogs/${id}`, data)
    return response.data
  },
}
