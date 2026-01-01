'use client'

import { signInWithGoogle, signInWithMicrosoft, logout, auth } from '../firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

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

/**
 * OAuth Login with Backend
 */
export async function loginWithOAuth(provider: 'google' | 'microsoft'): Promise<ApiResponse<any>> {
  try {
    const result = provider === 'google' 
      ? await signInWithGoogle()
      : await signInWithMicrosoft()
    
    const firebaseToken = await result.user.getIdToken()
    
    // Send Firebase token to backend
    const response = await fetch(`${API_BASE_URL}/auths/users/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        token: firebaseToken
      })
    })
    
    const backendResult = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        error: backendResult?.message || 'OAuth login failed'
      }
    }
    
    // Store backend token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', backendResult.data.token)
    }
    
    return {
      success: true,
      data: backendResult.data,
      message: backendResult.message
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'OAuth login failed'
    }
  }
}

/**
 * Firebase Logout
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  try {
    await logout()

    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }

    return {
      success: true,
      message: 'Logout successful'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Logout failed'
    }
  }
}

/**
 * Auth State Listener
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}






