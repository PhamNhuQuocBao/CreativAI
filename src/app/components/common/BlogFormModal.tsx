'use client'

import React, { KeyboardEvent, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CkEditor from './CKEditor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const BlogFormModal = () => {
  const [editorData, setEditorData] = useState<string>('')
  const [data, setData] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [tagField, setTagField] = useState('')

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === 'description') {
      console.log('Editor data field:', editor)
      setData(editor)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagField.trim() !== '') {
      e.preventDefault()
      const newTag = tagField.trim()
      let formattedTag: string = ''

      if (!newTag.startsWith('#')) {
        formattedTag = `#${newTag}`
      }
      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag])
      }
      setTagField('')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus />
          <span>Create new post</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[80%]">
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex gap-4">
              {/* FORM */}
              <div className="space-y-4 flex-1">
                {/* TITLE */}
                <div className="space-y-1.5 w-full">
                  <Label htmlFor="title" className="text-black">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input type="text" id="title" placeholder="Title" required />
                </div>

                {/* CONTENT EDITOR */}
                <div className="space-y-1.5 ">
                  <Label htmlFor="content" className="text-black">
                    Content
                  </Label>
                  <CkEditor
                    editorData={editorData}
                    setEditorData={setEditorData}
                    handleOnUpdate={handleOnUpdate}
                  />
                </div>

                {/* TAGS */}
                <div className="space-y-1.5 w-full">
                  <Label htmlFor="tags" className="text-black">
                    Tags
                  </Label>
                  <Input
                    type="text"
                    id="tags"
                    placeholder="Tags"
                    value={tagField}
                    onChange={(e) => setTagField(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium relative group transition-all duration-200 shadow-sm"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => {
                            const updatedTags = [...tags]
                            updatedTags.splice(index, 1)
                            setTags(updatedTags)
                          }}
                          className="w-5 h-5 flex items-center justify-center bg-red-400 text-white rounded-full text-xs hover:bg-red-500 transition duration-150 cursor-pointer"
                          aria-label="Remove tag"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PREVIEW */}
              <div className="flex gap-4 flex-col flex-1">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: data }}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Draft</AlertDialogAction>
          <AlertDialogAction>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BlogFormModal
