import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services'
import { QUERY_KEY } from '@/constants'

export const useBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.BLOGS],
    queryFn: blogService.getAllBlogs,
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
