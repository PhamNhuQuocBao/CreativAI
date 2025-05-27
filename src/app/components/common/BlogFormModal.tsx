'use client'

import React, { KeyboardEvent, useCallback, useState, useEffect } from 'react'
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
import { Plus, Loader2, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import CkEditor from './CKEditor'
import { useCreateBlog, useUpdateBlog } from '@/hooks/query-services/blog'
import useToast from '@/hooks/use-toast'
import { BlogResponseType } from '@/types/blog'

interface BlogFormData {
  title: string
  content: string
  description: string
  tags: string[]
  status: 'draft' | 'published'
  aiGenerated?: {
    content: string
    images: string[]
    modelUsed: string
    prompt: string
    _id: string
  }
}

interface BlogFormModalProps {
  blog?: BlogResponseType
  mode?: 'create' | 'update'
}

const defaultFormData: BlogFormData = {
  title: '',
  content: '',
  description: '',
  tags: [],
  status: 'published',
}

const BlogFormModal = ({ blog, mode = 'create' }: BlogFormModalProps) => {
  const { error, success } = useToast()
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData)
  const [editorData, setEditorData] = useState<string>('')
  const [previewData, setPreviewData] = useState<string>('')
  const [tagField, setTagField] = useState('')
  const [prompt, setPrompt] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const { mutate: createBlog, isPending: isCreating } = useCreateBlog()
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog()

  useEffect(() => {
    if (blog && mode === 'update') {
      setFormData({
        title: blog.title,
        content: blog.content,
        description: blog.content.slice(0, 150), // Using content as description for now
        tags: blog.tags,
        status: blog.status,
        aiGenerated: blog.aiGenerated,
      })
      setEditorData(blog.content)
      setPreviewData(blog.content)
    }
  }, [blog, mode])

  const handleOnUpdate = (content: string): void => {
    setPreviewData(content)
    setFormData((prev) => ({
      ...prev,
      content,
    }))

    console.log(content)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagField.trim() !== '') {
      e.preventDefault()
      const newTag = tagField.trim()
      const formattedTag: string = newTag.startsWith('#')
        ? newTag
        : `#${newTag}`

      if (!formData.tags.includes(formattedTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, formattedTag],
        }))
      }
      setTagField('')
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // TODO: Need Cloudinary credentials (cloud_name, api_key, upload_preset)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'mlusmkhs') // TODO: Add upload preset

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dx5wheahz/image/upload`, // TODO: Add cloud name
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return response.data.secure_url
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err)
      error('Failed to upload image')
      throw err
    }
  }

  const handleGenerateContent = useCallback(async () => {
    if (!prompt) {
      error('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    try {
      const response = await axios.post('/api/content-generator', {
        prompt,
      })

      const content: string = response.data.content
      const contentFormatted = content.replace(/```(html)?|```/g, '').trim()

      if (contentFormatted) {
        console.log(contentFormatted)

        setEditorData(contentFormatted)
      }
      setPreviewData(contentFormatted)
      setFormData((prev) => ({
        ...prev,
        content: contentFormatted,
        aiGenerated: {
          content: contentFormatted,
          prompt,
          modelUsed: 'gemini-2.0-flash',
          images: [],
          _id: prev.aiGenerated?._id || '',
        },
      }))
      success('Content generated successfully')
    } catch (err) {
      console.error('Error generating content:', err)
      error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }, [error, prompt, success])

  const handleGenerateImage = useCallback(async () => {
    if (!imagePrompt) {
      error('Please enter an image prompt')
      return
    }

    setIsGeneratingImage(true)
    try {
      const response = await axios.post('/api/image-generator', {
        prompt: imagePrompt,
      })

      const imageUrl = response.data.imageUrl
      // Upload local image to Cloudinary
      const imageResponse = await fetch(imageUrl)
      const imageBlob = await imageResponse.blob()
      const formData = new FormData()
      formData.append('file', imageBlob)
      formData.append('upload_preset', 'mlusmkhs')

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dx5wheahz/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const cloudinaryData = await cloudinaryResponse.json()
      const imageUrlCloud = cloudinaryData.secure_url
      console.log('imageUrlCloud', imageUrlCloud)
      if (imageUrlCloud) {
        // Insert image into editor content
        const imageHtml = `<figure class="image"><img src="${imageUrlCloud}" alt="${imagePrompt}"></figure>`
        setEditorData((prev) => prev + imageHtml)
        setPreviewData((prev) => prev + imageHtml)
        setFormData((prev) => ({
          ...prev,
          content: prev.content + imageHtml,
        }))
        success('Image generated successfully')
      }
    } catch (err) {
      console.error('Error generating image:', err)
      error('Failed to generate image')
    } finally {
      setIsGeneratingImage(false)
      setImagePrompt('')
    }
  }, [error, imagePrompt, success])

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      const payload = {
        ...formData,
        status,
        aiGenerated: formData.aiGenerated
          ? {
              ...formData.aiGenerated,
              images: formData.aiGenerated.images || [],
              _id: formData.aiGenerated._id || '',
            }
          : undefined,
      }

      if (mode === 'update' && blog) {
        updateBlog({
          id: blog._id,
          data: payload,
        })
      } else {
        createBlog(payload)
      }

      // Reset form
      setFormData(defaultFormData)
      setEditorData('')
      setPreviewData('')
      setPrompt('')
    } catch (error) {
      console.error('Error saving blog:', error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          {mode === 'create' ? (
            <>
              <Plus className="mr-2" />
              <span>Create new post</span>
            </>
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'create'
              ? 'Fill in the details below to create a new blog post.'
              : 'Update the details of your blog post.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Form Content */}
        <div className="flex gap-4 py-4">
          {/* FORM */}
          <div className="space-y-4 flex-1">
            {/* TITLE */}
            <div className="space-y-1.5 w-full">
              <Label htmlFor="title" className="text-black">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Title"
                required
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* AI CONTENT GENERATOR */}
            <div className="space-y-1.5 w-full">
              <Label htmlFor="prompt" className="text-black">
                AI Content Generator
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="prompt"
                  placeholder="Enter prompt for AI content generation"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <Button onClick={handleGenerateContent} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>

            {/* AI IMAGE GENERATOR */}
            <div className="space-y-1.5 w-full">
              <Label htmlFor="imagePrompt" className="text-black">
                AI Image Generator
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="imagePrompt"
                  placeholder="Enter prompt for AI image generation"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  disabled={isGeneratingImage}
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </Button>
              </div>
            </div>

            {/* CONTENT EDITOR */}
            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-black">
                Content <span className="text-red-500">*</span>
              </Label>
              <CkEditor
                editorData={editorData}
                setEditorData={setEditorData}
                handleOnUpdate={handleOnUpdate}
                onImageUpload={handleImageUpload}
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
                placeholder="Press Enter to add tags"
                value={tagField}
                onChange={(e) => setTagField(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium relative group transition-all duration-200 shadow-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => {
                        const updatedTags = [...formData.tags]
                        updatedTags.splice(index, 1)
                        setFormData((prev) => ({
                          ...prev,
                          tags: updatedTags,
                        }))
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
              dangerouslySetInnerHTML={{ __html: previewData }}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleSubmit('draft')}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Saving...' : 'Save as Draft'}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => handleSubmit('published')}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Saving...' : 'Publish'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BlogFormModal
