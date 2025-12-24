'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Check, X, Phone } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// API Configuration
const BASE_URL = 'https://socialpilot-evimero-backend.onrender.com/api/v1'
const REGISTER_URL = `${BASE_URL}/auths/users/register`
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const BACKEND_OAUTH_URL = `${BASE_URL}/auths/users/oauth?provider=google`

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)

  // Load Google Identity Services script on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check if script is already loaded
    if ((window as any).google?.accounts) {
      setGoogleScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      setGoogleScriptLoaded(true)
      console.log('Google Identity Services loaded')
    }
    script.onerror = () => {
      console.error('Failed to load Google Identity Services')
    }
    document.head.appendChild(script)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      })

      const result = await response.json().catch(() => null)

      const statusCode = result?.status_code ?? response.status
      const message =
        result?.message || (response.ok ? 'Registration successful. Please check your email for the verification code.' : 'Registration failed.')

      if (!response.ok || statusCode >= 400) {
        setError(message)
        setIsLoading(false)
        return
      }

      // Store email for OTP verification
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('pending_registration_email', formData.email)
        
        // Store access token if provided (might be needed for OTP validation)
        if (result?.access_token || result?.token) {
          window.localStorage.setItem('access_token', result.access_token || result.token)
        }
      }

      setSuccess('Registration successful! Please check your email for the verification code.')

      // Redirect to OTP verification page
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`)
      }, 1500)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  // Function to send the Google token to your backend
  const sendTokenToBackend = async (token: string) => {
    try {
      console.log('Sending token to backend...')
      
      const response = await fetch(BACKEND_OAUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'google',
          token: token,
        }),
      })

      const result = await response.json().catch(() => null)
      
      console.log('Backend response:', result)

      if (!response.ok) {
        const errorMessage = result?.message || 'Authentication failed'
        console.error('Backend error:', errorMessage)
        setError(errorMessage)
        setIsLoading(false)
        return
      }

      // Success - mark user as authenticated and redirect
      console.log('Authentication successful!')
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('yf_auth', 'true')
        if (result?.access_token) {
          window.localStorage.setItem('access_token', result.access_token)
        }
        if (result?.refresh_token) {
          window.localStorage.setItem('refresh_token', result.refresh_token)
        }
      }
      
      router.push('/dashboard')
    } catch (err) {
      console.error('Network error:', err)
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  // Handle Google Sign-In button click
  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setError('')

    if (!googleScriptLoaded || !(window as any).google?.accounts) {
      setError('Google Sign-In is still loading. Please try again.')
      setIsLoading(false)
      return
    }

    const google = (window as any).google

    if (!GOOGLE_CLIENT_ID) {
      const oauth2Client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error('Google OAuth error:', tokenResponse.error)
            setError('Google sign-in failed. Please try again.')
            setIsLoading(false)
            return
          }

          if (tokenResponse.access_token) {
            console.log('Got access token from Google')
            await sendTokenToBackend(tokenResponse.access_token)
          }
        },
      })

      oauth2Client.requestAccessToken({ prompt: 'select_account' })
      return
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        if (response.credential) {
          console.log('Got ID token from Google')
          await sendTokenToBackend(response.credential)
        } else {
          console.error('No credential received from Google')
          setError('Failed to get credentials from Google.')
          setIsLoading(false)
        }
      },
    })

    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log('One Tap not displayed, using popup flow')
        const oauth2Client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.error('Google OAuth error:', tokenResponse.error)
              setError('Google sign-in was cancelled or failed.')
              setIsLoading(false)
              return
            }

            if (tokenResponse.access_token) {
              console.log('Got access token from Google popup')
              await sendTokenToBackend(tokenResponse.access_token)
            }
          },
        })

        oauth2Client.requestAccessToken({ prompt: 'select_account' })
      } else if (notification.isSkippedMoment()) {
        console.log('One Tap skipped by user')
        setIsLoading(false)
      } else if (notification.isDismissedMoment()) {
        console.log('One Tap dismissed')
        setIsLoading(false)
      }
    })
  }

  const handleOAuthSignIn = async (provider: 'google' | 'microsoft') => {
    if (provider === 'google') {
      handleGoogleSignIn()
    } else {
      setIsLoading(true)
      setError('Microsoft sign-in coming soon')
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500']

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Create an account to start managing your social media</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && !error && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="08111111111"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {strengthLabels[passwordStrength - 1] || 'Too short'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <X className="h-3 w-3 mr-1" />
                    Passwords do not match
                  </p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <p className="mt-1 text-xs text-emerald-600 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOAuthSignIn('microsoft')}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Microsoft
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}