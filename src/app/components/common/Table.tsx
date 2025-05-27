'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBlogs, useDeleteBlog } from '@/hooks/query-services/blog'
import ErrorMessage from './ErrorMessage'
import { TableSkeleton } from './TableSkeleton'
import { PaginationControls } from './Pagination'
import { useState } from 'react'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import BlogFormModal from './BlogFormModal'
import { cn } from '@/lib/utils'

const ITEMS_PER_PAGE = 15

export function TableDemo() {
  const { data, isLoading, error } = useBlogs()
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog()
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <TableSkeleton />
  if (error) return <ErrorMessage error={error} />

  const totalItems = data?.length || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Calculate the current page's data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = data?.slice(startIndex, endIndex)

  const handleDelete = (blogId: string) => {
    deleteBlog(blogId)
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <div className="overflow-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableCaption>A list of your recent blogs.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[300px]">Description</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[200px] text-right">
                      Created At
                    </TableHead>
                    <TableHead className="min-w-[120px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData?.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {blog.title}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {blog.content}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                            {
                              'bg-green-50 text-green-700 ring-green-600/20':
                                blog.status === 'published',
                              'bg-yellow-50 text-yellow-700 ring-yellow-600/20':
                                blog.status === 'draft',
                            }
                          )}
                        >
                          {blog.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {new Date(blog.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <BlogFormModal mode="update" blog={blog} />
                          <DeleteConfirmDialog
                            onDelete={() => handleDelete(blog._id)}
                            isDeleting={isDeleting}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
