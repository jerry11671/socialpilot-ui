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
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  name?: string
  image?: string | null
  phone?: string
  created_at?: string
  updated_at?: string
  [key: string]: any // Allow for additional fields
}

/**
 * Get current user profile
 * GET /users/me
 */
export async function getMe(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMessage = result?.message || result?.error || 'Failed to fetch user profile'
    throw new Error(errorMessage)
  }

  // Handle different response formats
  const userData = result?.data || result?.user || result
  
  if (!userData) {
    throw new Error('Invalid user data received')
  }

  // Ensure name is set from first_name and last_name if not provided
  if (!userData.name && (userData.first_name || userData.last_name)) {
    userData.name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
  }

  return userData
}

