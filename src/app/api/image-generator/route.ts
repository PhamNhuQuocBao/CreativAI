// app/api/generateImagePrompt/route.ts
import { NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from '@google/genai'
import * as fs from 'node:fs'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: `Generate a prompt for an AI image generation model based on this idea: "${topic}".`,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    })
    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    if (!response?.candidates) {
      return NextResponse.json(
        { error: 'No content in response' },
        { status: 500 }
      )
    }

    const imageName = 'gemini-native-image.png'
    const imagePath = `public/${imageName}`
    for (const part of response?.candidates[0]?.content?.parts || []) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text)
      } else if (part.inlineData) {
        const imageData = part.inlineData.data
        if (imageData) {
          const buffer = Buffer.from(imageData, 'base64')
          fs.writeFileSync(imagePath, buffer)
          console.log('Image saved as ', imagePath)
        } else {
          console.error('No image data available')
        }
      }
    }
    return NextResponse.json({ imageName })
  } catch (error) {
    console.error('Error generating image prompt:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
