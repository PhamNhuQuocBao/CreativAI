import BlogFormModal from '@/app/components/common/BlogFormModal'
import { TableDemo } from '@/app/components/common/Table'
import React from 'react'

const Page = () => {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Blog List</h1>
        <BlogFormModal />
      </div>

      <div className="my-2">
        <TableDemo />
      </div>
    </div>
  )
}

export default Page
