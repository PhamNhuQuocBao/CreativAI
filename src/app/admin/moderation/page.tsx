'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, FlaggedBlog } from '@/services/admin.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { format } from 'date-fns'
import useToast from '@/hooks/use-toast'

const ModerationPage = () => {
  const { success, error } = useToast()
  const queryClient = useQueryClient()
  const [selectedBlog, setSelectedBlog] = useState<FlaggedBlog | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const { data: flaggedBlogs, isLoading } = useQuery({
    queryKey: ['flaggedBlogs'],
    queryFn: () => adminService.getFlaggedBlogs(),
  })

  const approveMutation = useMutation({
    mutationFn: (blogId: string) =>
      adminService.reviewBlog(blogId, { action: 'approve' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedBlogs'] })
      success('Blog approved successfully')
    },
    onError: () => {
      error('Failed to approve blog')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ blogId, reason }: { blogId: string; reason: string }) =>
      adminService.reviewBlog(blogId, { action: 'reject', reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedBlogs'] })
      setIsRejectDialogOpen(false)
      setRejectReason('')
      success('Blog rejected successfully')
    },
    onError: () => {
      error('Failed to reject blog')
    },
  })

  const handleApprove = (blogId: string) => {
    approveMutation.mutate(blogId)
  }

  const handleReject = () => {
    if (!selectedBlog || !rejectReason) return
    rejectMutation.mutate({ blogId: selectedBlog._id, reason: rejectReason })
  }

  const openRejectDialog = (blog: FlaggedBlog) => {
    setSelectedBlog(blog)
    setIsRejectDialogOpen(true)
  }

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Moderation</h1>
        <Badge variant="outline">
          {flaggedBlogs?.length || 0} Pending Reviews
        </Badge>
      </div>

      <div className="grid gap-4">
        {flaggedBlogs?.map((blog) => (
          <Card key={blog._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{blog.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    by {blog.author.name} •{' '}
                    {format(new Date(blog.createdAt), 'PPP')}
                  </p>
                </div>
                <Badge className={getSeverityColor(blog.moderation.severity)}>
                  {blog.moderation.severity} risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Flagged Reasons:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {blog.moderation.reasons.map((reason, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">AI Explanation:</h3>
                  <p className="text-sm text-muted-foreground">
                    {blog.moderation.explanation}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleApprove(blog._id)}
                    disabled={approveMutation.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => openRejectDialog(blog)}
                    disabled={rejectMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Blog</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this blog. This will be sent
              to the author.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason || rejectMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ModerationPage
