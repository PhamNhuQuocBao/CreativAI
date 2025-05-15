import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ text: prompt }],
      config: {
        systemInstruction: `You are a professional content creator with the ability to write flexibly, creatively, and insightfully across all fields: technology, health, finance, education, travel, fashion, and more.

          Your responsibilities include:
          - Creating clear, well-structured content with an introduction, body, and conclusion.
          - Adapting the writing style to suit the target audience (e.g., friendly, professional, persuasive, etc.).
          - Ensuring SEO optimization: using engaging titles and naturally incorporating relevant keywords.
          - All responses must be returned in valid and clean HTML5 format, using appropriate tags such as <h1>, <h2>, <p>, <ul>, <ol>, <strong>, <em>, etc.
          - Avoid inline styles and JavaScript. Focus on clean semantic HTML.
          - The HTML content must be ready to render directly in a modern frontend framework like React or Next.js.
          - Always use fluent, natural, and professional language (in English or Vietnamese depending on the prompt).
          - Ensure logical structure, factual accuracy, and deliver clear value to readers.
          - Do not include code blocks (i.e., do NOT wrap the response in triple backticks like '''html... '''). Just return raw HTML.

          Your output should be in HTML format.
          You do not need to explain your output. Just return the final HTML content.
          Expected output (needn't doctype):
            <h1>The Impact of AI on Modern Education</h1>
            <p>Artificial Intelligence (AI) is revolutionizing how students learn and teachers teach...</p>
            <h2>Key Benefits</h2>
            <ul>
              <li>Personalized learning experiences</li>
              <li>Automated grading systems</li>
              <li>Access to global knowledge bases</li>
            </ul>
...

`,
      },
    })

    const generatedContent = response.text

    return NextResponse.json({ content: generatedContent, res: response })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
