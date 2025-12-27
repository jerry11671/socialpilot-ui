import { NextRequest, NextResponse } from 'next/server'

interface GenerateImageRequest {
  prompt: string
  style?: string
  size?: string
  quality?: string
}

export async function POST(request: NextRequest) {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          status: 401,
          message: 'Unauthorized. Bearer token required.',
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Parse request body
    const body: GenerateImageRequest = await request.json()

    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Prompt is required',
        },
        { status: 400 }
      )
    }

    // Get OpenAI API key from environment variable
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not configured')
      return NextResponse.json(
        {
          status: 500,
          message: 'Image generation service is not configured',
        },
        { status: 500 }
      )
    }

    // Map style to DALL-E style parameter
    // DALL-E 3 supports: "vivid" or "natural"
    const style = body.style?.toLowerCase() === 'vivid' ? 'vivid' : 'natural'

    // Validate and set size (DALL-E 3 supports: "1024x1024", "1792x1024", "1024x1792")
    const validSizes = ['1024x1024', '1792x1024', '1024x1792']
    const size = body.size && validSizes.includes(body.size) ? body.size : '1024x1024'

    // Validate quality (DALL-E 3 supports: "standard" or "hd")
    const quality = body.quality === 'hd' ? 'hd' : 'standard'

    // Call OpenAI DALL-E API
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: body.prompt,
        n: 1,
        size: size,
        quality: quality,
        style: style,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}))
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        {
          status: openaiResponse.status,
          message: errorData.error?.message || 'Failed to generate image',
        },
        { status: openaiResponse.status }
      )
    }

    const openaiData = await openaiResponse.json()

    // Format response according to specification
    const imageData = openaiData.data?.[0]
    if (!imageData) {
      return NextResponse.json(
        {
          status: 500,
          message: 'No image data received from generation service',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 200,
      message: 'Image generated successfully',
      data: {
        image: {
          url: imageData.url,
          revised_prompt: imageData.revised_prompt || body.prompt,
        },
      },
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      {
        status: 500,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}


