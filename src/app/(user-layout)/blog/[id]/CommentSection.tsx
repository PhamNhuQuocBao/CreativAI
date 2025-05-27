'use client'

import { useState } from 'react'
import { useComments } from '@/hooks/use-comment'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, MoreVertical, Trash, Edit } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import authService from '@/services/auth.service'

interface CommentSectionProps {
  blogId: string
  className?: string
}

export function CommentSection({ blogId, className }: CommentSectionProps) {
  const { comments, isLoading, createComment, updateComment, deleteComment } =
    useComments(blogId)
  const user = authService.getCurrentUser()

  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    createComment({ content: newComment })
    setNewComment('')
  }

  const handleEdit = (commentId: string, content: string) => {
    setEditingComment(commentId)
    setEditContent(content)
    setDropdownOpen(null)
  }

  const handleUpdate = (commentId: string) => {
    if (!editContent.trim()) return

    updateComment({ commentId, content: editContent })
    setEditingComment(null)
    setEditContent('')
  }

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId)
    setDeleteDialogOpen(true)
    setDropdownOpen(null)
  }

  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete)
      setCommentToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment._id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage
                  src={comment.userId.avatar || 'https://github.com/shadcn.png'}
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      {comment.userId.name || 'Anonymous'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {user?._id === comment.userId._id && (
                    <DropdownMenu.Root
                      open={dropdownOpen === comment._id}
                      onOpenChange={(open) =>
                        setDropdownOpen(open ? comment._id : null)
                      }
                    >
                      <DropdownMenu.Trigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                          align="end"
                        >
                          <DropdownMenu.Item
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            onSelect={() =>
                              handleEdit(comment._id, comment.content)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-red-600"
                            onSelect={() => handleDeleteClick(comment._id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  )}
                </div>
                {editingComment === comment._id ? (
                  <div className="mt-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(comment._id)}
                        disabled={!editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingComment(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2">{comment.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
