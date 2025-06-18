import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCIS916Y_HlNAveCAQGDN0l6A4wDPlRwaA')

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Get the Gemini model (using gemini-2.0-flash-exp as specified)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Create a comprehensive prompt for paraphrasing
    const prompt = `You are an expert writing assistant. Please paraphrase the following text while:

1. Maintaining the original meaning and intent
2. Using different words and sentence structures
3. Keeping the same tone and style
4. Preserving all important information
5. Making it natural and fluent
6. Keeping approximately the same length

Text to paraphrase:
"${text}"

Please provide only the paraphrased version without any additional commentary or explanation.`

    // Generate the paraphrased content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const paraphrasedText = response.text().trim()

    return NextResponse.json({
      paraphrasedText,
      originalText: text
    })
  } catch (error) {
    console.error('Paraphrase API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to paraphrase text. Please try again.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
