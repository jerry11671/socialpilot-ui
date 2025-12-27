'use client'

const API_BASE_URL = 'https://socialpilot-evimero-backend.onrender.com/api/v1'

// Get auth headers helper
const getAuthHeaders = (): HeadersInit => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  return headers
}

// Types
export interface GenerateCaptionData {
  topic: string
  tone: string
  length: string
}

export interface CaptionResponse {
  caption: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Generate AI Caption
 * POST /ai/caption
 */
export async function generateCaption(data: GenerateCaptionData): Promise<ApiResponse<CaptionResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/caption`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate caption',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Caption generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate caption:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Hashtag Generation Types
export interface GenerateHashtagsData {
  content: string
  platform: string
  count: number
  includeTrending: boolean
}

export interface HashtagsResponse {
  hashtags: string[]
}

/**
 * Generate AI Hashtags
 * POST /ai/hashtags
 */
export async function generateHashtags(data: GenerateHashtagsData): Promise<ApiResponse<HashtagsResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/hashtags`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate hashtags',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Hashtags generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate hashtags:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Video Script Generation Types
export interface GenerateVideoScriptData {
  topic: string
  duration: string
  style: string
  platform: string
  includeVisualCues: boolean
}

export interface VideoScriptResponse {
  script: string
}

/**
 * Generate AI Video Script
 * POST /ai/video-script
 */
export async function generateVideoScript(data: GenerateVideoScriptData): Promise<ApiResponse<VideoScriptResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/video-script`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate video script',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Video script generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate video script:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Content Ideas Generation Types
export interface GenerateContentIdeasData {
  industry: string
  count: number
  targetAudience: string
  contentType: string
}

export interface ContentIdeasResponse {
  ideas: string
}

/**
 * Generate AI Content Ideas
 * POST /ai/content-ideas
 */
export async function generateContentIdeas(data: GenerateContentIdeasData): Promise<ApiResponse<ContentIdeasResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/content-ideas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate content ideas',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Content ideas generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate content ideas:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Image Generation Types
export interface GenerateImageData {
  prompt: string
  style?: string
  size?: string
  quality?: string
}

export interface ImageResponse {
  image: {
    url: string
    revised_prompt: string
  }
}

/**
 * Generate AI Image
 * POST /ai/image
 */
export async function generateImage(data: GenerateImageData): Promise<ApiResponse<ImageResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate image',
      }
    }

    return {
      success: true,
      data: result?.data || result?.data,
      message: result?.message || 'Image generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate image:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// CTA Generation Types
export interface GenerateCTAData {
  content: string
  platform: string
  count: number
  goal: string
}

export interface CTAResponse {
  ctas: string
}

/**
 * Generate AI CTAs
 * POST /ai/ctas
 */
export async function generateCTAs(data: GenerateCTAData): Promise<ApiResponse<CTAResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/ctas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate CTAs',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'CTAs generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate CTAs:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Content Variations Generation Types
export interface GenerateVariationsData {
  content: string
  platform: string
  count: number
  variationTypes: string[]
}

export interface VariationsResponse {
  variations: string
}

/**
 * Generate AI Content Variations
 * POST /ai/variations
 */
export async function generateVariations(data: GenerateVariationsData): Promise<ApiResponse<VariationsResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/variations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to generate variations',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Variations generated successfully',
    }
  } catch (err) {
    console.error('Failed to generate variations:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

