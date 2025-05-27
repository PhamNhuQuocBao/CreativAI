import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { APIs } from '@/config'
import { ENDPOINTS } from '@/constants'
import useToast from './use-toast'

interface Comment {
  _id: string
  content: string
  userId: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  blogId: string
  parentId: string | null
  replies: Comment[]
  createdAt: string
  updatedAt: string
}

interface CommentResponse {
  success: boolean
  data: Comment | Comment[] | { message: string }
}

export const useCommentCount = (blogId: string) => {
  const { data: comments } = useQuery({
    queryKey: ['blog', blogId, 'comments'],
    queryFn: async () => {
      const response = await APIs.get<CommentResponse>(
        `${ENDPOINTS.COMMENTS}/blog/${blogId}`
      )
      return response.data.data as Comment[]
    },
  })

  // Count total comments including replies
  const totalComments = (comments ?? []).reduce(
    (acc, comment) => acc + 1 + (comment.replies?.length ?? 0),
    0
  )

  return { count: totalComments }
}

export const useComments = (blogId: string) => {
  const { error, success } = useToast()
  const queryClient = useQueryClient()

  // Get comments for a blog
  const {
    data: comments,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['blog', blogId, 'comments'],
    queryFn: async () => {
      const response = await APIs.get<CommentResponse>(
        `${ENDPOINTS.COMMENTS}/blog/${blogId}`
      )
      return response.data.data as Comment[]
    },
  })

  // Create comment mutation
  const { mutate: createComment } = useMutation({
    mutationFn: async ({
      content,
      parentId,
    }: {
      content: string
      parentId?: string
    }) => {
      const response = await APIs.post<CommentResponse>(
        `${ENDPOINTS.COMMENTS}/blog/${blogId}`,
        { content, parentId }
      )
      return response.data
    },
    onSuccess: () => {
      success('Comment added successfully')
      queryClient.invalidateQueries({ queryKey: ['blog', blogId, 'comments'] })
    },
    onError: () => {
      error('Failed to add comment')
    },
  })

  // Update comment mutation
  const { mutate: updateComment } = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string
      content: string
    }) => {
      const response = await APIs.put<CommentResponse>(
        `${ENDPOINTS.COMMENTS}/${commentId}`,
        { content }
      )
      return response.data
    },
    onSuccess: () => {
      success('Comment updated successfully')
      queryClient.invalidateQueries({ queryKey: ['blog', blogId, 'comments'] })
    },
    onError: () => {
      error('Failed to update comment')
    },
  })

  // Delete comment mutation
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await APIs.delete<CommentResponse>(
        `${ENDPOINTS.COMMENTS}/${commentId}`
      )
      return response.data
    },
    onSuccess: () => {
      success('Comment deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['blog', blogId, 'comments'] })
    },
    onError: () => {
      error('Failed to delete comment')
    },
  })

  return {
    comments,
    isLoading,
    error: queryError,
    createComment,
    updateComment,
    deleteComment,
  }
}

export const useLatestComments = (blogId: string, limit: number = 2) => {
  const { data: comments } = useQuery({
    queryKey: ['blog', blogId, 'comments', 'latest'],
    queryFn: async () => {
      const response = await APIs.get<CommentResponse>(
        `${ENDPOINTS.COMMENTS}/blog/${blogId}`
      )
      const allComments = response.data.data as Comment[]
      return allComments
        .filter((comment) => !comment.parentId) // Only get top-level comments
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit)
    },
  })

  return { comments }
}
