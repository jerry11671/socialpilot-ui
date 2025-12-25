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

