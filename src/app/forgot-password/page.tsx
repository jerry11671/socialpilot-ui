'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(
        'https://socialpilot-evimero-backend.onrender.com/api/v1/auths/users/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: email,
          }),
        }
      )

      const result = await response.json().catch(() => null)

      const statusCode = result?.status_code ?? response.status
      const message =
        result?.message || (response.ok ? 'Password reset email sent successfully.' : 'Failed to send reset email.')

      if (!response.ok || statusCode >= 400) {
        setError(message)
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        <Card>
          {!isSubmitted ? (
            <>
              <CardHeader>
                <CardTitle>Forgot your password?</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <CardTitle className="text-center">Check your email</CardTitle>
                <CardDescription className="text-center">
                  We've sent a password reset link to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p className="mb-2">Didn't receive the email? Check your spam folder or try again.</p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Send another email
                  </Button>
                  
                  <Link href="/login">
                    <Button 
                      variant="ghost"
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

