'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { validateRegistrationToken } from '@/lib/api/auth'

function VerifyOTPForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [identifier, setIdentifier] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get identifier from URL params or localStorage
    const emailFromUrl = searchParams.get('email')
    const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('pending_registration_email') : null
    
    const email = emailFromUrl || emailFromStorage || ''
    setIdentifier(email)
    
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [searchParams])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newOtp = [...otp]
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)
        // Focus the last filled input or the last input
        const lastIndex = Math.min(digits.length - 1, 5)
        inputRefs.current[lastIndex]?.focus()
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    if (!identifier) {
      setError('Email address is missing. Please sign up again.')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await validateRegistrationToken({
        identifier,
        otp: otpString,
        otp_type: 'CREATE_ACCOUNT',
      })

      if (response.success) {
        setSuccess('Registration completed successfully!')
        
        // Store auth tokens if provided
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('yf_auth', 'true')
          
          // Store access token if provided in response
          if (response.data?.access_token || response.data?.token) {
            window.localStorage.setItem('access_token', response.data.access_token || response.data.token)
          }
          
          // Store refresh token if provided
          if (response.data?.refresh_token) {
            window.localStorage.setItem('refresh_token', response.data.refresh_token)
          }
          
          // Store user data if provided
          if (response.data?.user) {
            window.localStorage.setItem('user', JSON.stringify(response.data.user))
          }
          
          // Clear pending registration email
          window.localStorage.removeItem('pending_registration_email')
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(response.error || 'Invalid OTP. Please try again.')
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      console.error('OTP validation error:', err)
      setError('Network error. Please check your connection and try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to{' '}
          <span className="font-medium text-gray-900">{identifier || 'your email'}</span>
        </CardDescription>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter the 6-digit code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={() => {
                // TODO: Implement resend OTP functionality
                setError('Resend functionality coming soon. Please check your email.')
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Resend code
            </button>
          </p>
          
          <Link 
            href="/signup" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-gray-500 mt-2">Verify your email address</p>
        </div>

        <Suspense fallback={
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
              <p className="mt-4 text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        }>
          <VerifyOTPForm />
        </Suspense>
      </div>
    </div>
  )
}




