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

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Validate registration token (OTP)
 * POST /auths/users/complete-registration
 */
export async function validateRegistrationToken(data: {
  identifier: string
  otp: string
  otp_type: 'CREATE_ACCOUNT'
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auths/users/complete-registration`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Invalid OTP or registration session not found',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Registration completed successfully',
    }
  } catch (err) {
    console.error('Failed to validate registration token:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}



