import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useToast from './use-toast'
import { APIs } from '@/config'
import { ENDPOINTS } from '@/constants'
import { ReactionCounts } from '@/types/blog'

interface UserReaction {
  userId: string
  blogId: string
  reactionType: string
}

interface ReactionResponse {
  success: boolean
  data: {
    reactionCounts: ReactionCounts
    userReaction: UserReaction | null
  }
}

export const useReaction = (blogId: string) => {
  const { error, success } = useToast()
  const queryClient = useQueryClient()

  // Get user's reaction for the blog
  const { data: userReaction } = useQuery({
    queryKey: ['blog', blogId, 'reaction'],
    queryFn: async () => {
      const response = await APIs.get<ReactionResponse>(
        `${ENDPOINTS.REACTIONS}/${blogId}/user`
      )
      return response.data.data
    },
  })

  // Update reaction mutation
  const { mutate: updateReaction } = useMutation({
    mutationFn: async (reactionType: string) => {
      const response = await APIs.put<ReactionResponse>(
        `${ENDPOINTS.REACTIONS}/${blogId}`,
        { reactionType }
      )
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch both blog and reaction queries
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] })
      queryClient.invalidateQueries({ queryKey: ['blog', blogId, 'reaction'] })

      // Show success message
      const action = data.userReaction ? 'added' : 'removed'
      const reactionType = data.userReaction?.reactionType || ''
      success(`Successfully ${action} ${reactionType} reaction`)
    },
    onError: () => {
      error('Failed to update reaction. Please try again.')
    },
  })

  return {
    userReaction,
    updateReaction,
  }
}
