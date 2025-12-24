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
export interface PostVersion {
  id: string
  post_id: string
  version_number?: number
  content?: string
  title?: string
  status?: string
  created_at?: string
  createdAt?: string
  created_by?: string
  createdBy?: string
  user?: {
    id: string
    name?: string
    email: string
    first_name?: string
    last_name?: string
  }
  changes?: string
  [key: string]: any // Allow for additional fields
}

export interface PostMedia {
  url: string
  type: 'image' | 'video' | 'gif' | 'document'
  alt_text?: string
  [key: string]: any
}

export interface CreatePostData {
  content: string
  platforms: string[]
  media?: PostMedia[]
  tags?: string[]
  scheduled_at?: string
  timezone?: string
  [key: string]: any // Allow for additional fields
}

export interface UpdatePostData {
  content?: string
  platforms?: string[]
  media?: PostMedia[]
  tags?: string[]
  scheduled_at?: string
  timezone?: string
  [key: string]: any // Allow for additional fields
}

export interface Post {
  id: string
  content: string
  platforms?: string[]
  media?: PostMedia[]
  tags?: string[]
  status?: string
  scheduled_at?: string
  published_at?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
  created_by?: string
  [key: string]: any // Allow for additional fields
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Get all posts
 * GET /posts
 */
export async function getAllPosts(): Promise<ApiResponse<Post[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch posts',
      }
    }

    // Handle different response formats
    const posts = result?.data || result?.posts || result || []
    return {
      success: true,
      data: Array.isArray(posts) ? posts : [],
    }
  } catch (err) {
    console.error('Failed to fetch posts:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get a single post by ID
 * GET /posts/{{post_id}}
 */
export async function getPost(postId: string): Promise<ApiResponse<Post>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch post',
      }
    }

    // Handle different response formats
    const post = result?.data || result?.post || result
    
    if (!post) {
      return {
        success: false,
        error: 'Invalid post data received',
      }
    }

    return {
      success: true,
      data: post,
    }
  } catch (err) {
    console.error('Failed to fetch post:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Update a post
 * PUT /posts/{{post_id}}
 */
export async function updatePost(postId: string, data: UpdatePostData): Promise<ApiResponse<Post>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to update post',
      }
    }

    // Handle different response formats
    const post = result?.data || result?.post || result
    
    if (!post) {
      return {
        success: false,
        error: 'Invalid post data received',
      }
    }

    return {
      success: true,
      data: post,
    }
  } catch (err) {
    console.error('Failed to update post:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Delete a post
 * DELETE /posts/{{post_id}}?organization_id=...
 */
export async function deletePost(postId: string, organizationId?: string): Promise<ApiResponse<void>> {
  try {
    let url = `${API_BASE_URL}/posts/${postId}`
    if (organizationId) {
      url += `?organization_id=${organizationId}`
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to delete post',
      }
    }

    return {
      success: true,
    }
  } catch (err) {
    console.error('Failed to delete post:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Duplicate a post
 * POST /posts/{{post_id}}/duplicate
 */
export async function duplicatePost(postId: string): Promise<ApiResponse<Post>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to duplicate post',
      }
    }

    // Handle different response formats
    const post = result?.data || result?.post || result
    
    if (!post) {
      return {
        success: false,
        error: 'Invalid post data received',
      }
    }

    return {
      success: true,
      data: post,
    }
  } catch (err) {
    console.error('Failed to duplicate post:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Create a new post
 * POST /posts
 */
export async function createPost(data: CreatePostData): Promise<ApiResponse<Post>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to create post',
      }
    }

    // Handle different response formats
    const post = result?.data || result?.post || result
    
    if (!post) {
      return {
        success: false,
        error: 'Invalid post data received',
      }
    }

    return {
      success: true,
      data: post,
    }
  } catch (err) {
    console.error('Failed to create post:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * List versions for a post
 * GET /posts/{{post_id}}/versions
 */
export async function listPostVersions(postId: string): Promise<ApiResponse<PostVersion[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/versions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch post versions',
      }
    }

    // Handle different response formats
    const versions = result?.data || result?.versions || result || []
    return {
      success: true,
      data: Array.isArray(versions) ? versions : [],
    }
  } catch (err) {
    console.error('Failed to fetch post versions:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get a specific version of a post
 * GET /posts/{{post_id}}/versions/{{version_number}}
 */
export async function getPostVersion(postId: string, versionNumber: string | number): Promise<ApiResponse<PostVersion>> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/versions/${versionNumber}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch post version',
      }
    }

    // Handle different response formats
    const version = result?.data || result?.version || result
    
    if (!version) {
      return {
        success: false,
        error: 'Invalid version data received',
      }
    }

    return {
      success: true,
      data: version,
    }
  } catch (err) {
    console.error('Failed to fetch post version:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export interface VersionComparison {
  post_id: string
  version1: PostVersion
  version2: PostVersion
  differences?: {
    field: string
    old_value?: any
    new_value?: any
  }[]
  changes_summary?: string
  [key: string]: any // Allow for additional fields
}

/**
 * Compare two versions of a post
 * GET /posts/{{post_id}}/versions/compare?v1=1&v2=2
 */
export async function comparePostVersions(
  postId: string,
  v1: string | number,
  v2: string | number
): Promise<ApiResponse<VersionComparison>> {
  try {
    const url = new URL(`${API_BASE_URL}/posts/${postId}/versions/compare`)
    url.searchParams.set('v1', String(v1))
    url.searchParams.set('v2', String(v2))

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to compare post versions',
      }
    }

    // Handle different response formats
    const comparison = result?.data || result?.comparison || result
    
    if (!comparison) {
      return {
        success: false,
        error: 'Invalid comparison data received',
      }
    }

    return {
      success: true,
      data: comparison,
    }
  } catch (err) {
    console.error('Failed to compare post versions:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

