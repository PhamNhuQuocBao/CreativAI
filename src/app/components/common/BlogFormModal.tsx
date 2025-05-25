'use client'

import React, { KeyboardEvent, useCallback, useState } from 'react'
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
import { Plus, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ENDPOINTS } from '@/constants'
import { APIs } from '@/config'
import axios from 'axios'
import CkEditor from './CKEditor'

interface BlogFormData {
  title: string
  content: string
  description: string
  tags: string[]
  status: 'draft' | 'published'
  aiGenerated?: {
    content: string
    prompt: string
    modelUsed: string
  }
}

const BlogFormModal = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    description: '',
    tags: [],
    status: 'published',
  })
  const [editorData, setEditorData] = useState<string>('')
  const [previewData, setPreviewData] = useState<string>('')
  const [tagField, setTagField] = useState('')
  const [prompt, setPrompt] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

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
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error)
      throw error
    }
  }

  const handleGenerateContent = useCallback(async () => {
    if (!prompt) {
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
        },
      }))
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [prompt])

  const handleGenerateImage = useCallback(async () => {
    if (!imagePrompt) {
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
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGeneratingImage(false)
      setImagePrompt('')
    }
  }, [imagePrompt])

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      const payload = {
        ...formData,
        status,
      }

      const response = await APIs.post(ENDPOINTS.BLOGS, payload)
      console.log('Blog created:', response.data)

      // Reset form
      setFormData({
        title: '',
        content: '',
        description: '',
        tags: [],
        status: 'published',
      })
      setEditorData('')
      setPreviewData('')
      setPrompt('')
    } catch (error) {
      console.error('Error creating blog:', error)
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
      <AlertDialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Blog Post</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details below to create a new blog post.
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

            {/* DESCRIPTION */}
            <div className="space-y-1.5 w-full">
              <Label htmlFor="description" className="text-black">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="description"
                placeholder="Short description"
                required
                value={formData.description}
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
                placeholder="Tags"
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
          <AlertDialogAction onClick={() => handleSubmit('draft')}>
            Draft
          </AlertDialogAction>
          <AlertDialogAction onClick={() => handleSubmit('published')}>
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BlogFormModal
