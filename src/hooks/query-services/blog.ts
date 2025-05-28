import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BlogCreateInput, blogService } from '@/services'
import { QUERY_KEY } from '@/constants'

export const useBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.BLOGS],
    queryFn: blogService.getAllBlogs,
  })

  return { data, isLoading, error }
}

export const useDraftBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.BLOGS, 'drafts'],
    queryFn: blogService.getDraftBlogs,
  })

  return { data, isLoading, error }
}

export const usePublishedBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.BLOGS, 'published'],
    queryFn: blogService.getPublishedBlogs,
  })

  return { data, isLoading, error }
}

export const useBlog = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.BLOGS, id],
    queryFn: () => blogService.getBlogById(id),
    enabled: !!id,
  })

  return { data, isLoading, error }
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      // Invalidate all blog queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOGS] })
    },
  })
}

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<BlogCreateInput>
    }) => blogService.updateBlog(id, data),
    onSuccess: (updatedBlog) => {
      // Invalidate all blog queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOGS] })
      queryClient.setQueryData([QUERY_KEY.BLOGS, updatedBlog._id], updatedBlog)
    },
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: (_, deletedId) => {
      // Remove the blog from cache and invalidate all blog queries
      queryClient.removeQueries({ queryKey: [QUERY_KEY.BLOGS, deletedId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOGS] })
    },
  })
}
