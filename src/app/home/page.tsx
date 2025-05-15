'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

const Page = () => {
  const [prompt, setPrompt] = useState<string>('')

  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [generatedImage, setGeneratedImage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  const handleGenerateContent = useCallback(async () => {
    if (!prompt) {
      return
    }

    try {
      const response = await axios.post('/api/content-generator', {
        prompt,
      })

      const content: string = response.data.content
      const contentFormatted = content.replace('```html', '').replace('```', '')

      setGeneratedContent(contentFormatted)
    } catch (error) {
      console.error('Error generating content:', error)
    }
  }, [prompt])

  const handleGenerateContentImage = useCallback(async () => {
    if (!prompt) {
      return
    }

    try {
      const response = await axios.post('/api/image-generator', {
        topic: prompt,
      })

      console.log(response.data)
      setGeneratedImage(response.data.imageName)
    } catch (error) {
      console.error('Error generating content:', error)
    }
  }, [prompt])

  return (
    <div>
      <div className="flex gap-6">
        <div className="w-full space-y-2">
          <Input onChange={handleChange} placeholder="Content generator" />
          <Button onClick={handleGenerateContent}>Gen</Button>
        </div>

        <div className="w-full space-y-2">
          <Input onChange={handleChange} placeholder="Image generator" />
          <Button onClick={handleGenerateContentImage}>Gen</Button>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: generatedContent }}></div>
      <div>
        {generatedImage && (
          <Image
            src={`/${generatedImage}`}
            alt="image"
            width={300}
            height={300}
          />
        )}
      </div>
    </div>
  )
}

export default Page
