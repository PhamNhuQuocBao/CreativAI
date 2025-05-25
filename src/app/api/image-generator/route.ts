// app/api/image-generator/route.ts
import { NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from '@google/genai'
import * as fs from 'node:fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    })

    if (!response?.candidates?.[0]?.content?.parts) {
      return NextResponse.json(
        { error: 'No content in response' },
        { status: 500 }
      )
    }

    // Create images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public', 'generated-images')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }

    // Find the image part in the response
    const imagePart = response.candidates[0].content.parts.find(
      (part) => part.inlineData?.data
    )

    if (!imagePart?.inlineData?.data) {
      return NextResponse.json(
        { error: 'No image data in response' },
        { status: 500 }
      )
    }

    // Generate unique filename
    const imageId = uuidv4()
    const imageName = `${imageId}.png`
    const imagePath = path.join(imagesDir, imageName)

    // Save the image
    const imageData = imagePart.inlineData.data
    const buffer = Buffer.from(imageData, 'base64')
    fs.writeFileSync(imagePath, buffer)

    // Return the URL path that can be used to access the image
    const imageUrl = `/generated-images/${imageName}`
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.log('Error generating image:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
