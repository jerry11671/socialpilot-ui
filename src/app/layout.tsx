'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Pages that are publicly accessible (no login required)
  const publicPages = ['/', '/login', '/signup', '/forgot-password']
  const isPublicPage = publicPages.includes(pathname || '')

  // Simple client-side auth guard:
  // - For non-public pages, require a flag in localStorage
  // - If missing, redirect to login
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isPublicPage) {
      setIsAuthChecked(true)
      return
    }

    const hasAuth = window.localStorage.getItem('yf_auth') === 'true'

    if (!hasAuth) {
      router.replace('/login')
    } else {
      setIsAuthChecked(true)
    }
  }, [isPublicPage, router, pathname])

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {isPublicPage ? (
            // Public pages (landing, login, signup, forgot-password) - no sidebar/header
            <div className="min-h-screen w-full">
              {children}
            </div>
          ) : !isAuthChecked ? (
            // While checking auth, show a lightweight loading state
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">Checking access...</p>
            </div>
          ) : (
            // Authenticated pages - with sidebar and header
            <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
              {/* Desktop Sidebar - Fixed width, hidden on mobile */}
              <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-64">
                <ErrorBoundary>
                  <Sidebar />
                </ErrorBoundary>
              </aside>

              {/* Mobile Sidebar Sheet */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent className="w-64 p-0">
                  <ErrorBoundary>
                    <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
                  </ErrorBoundary>
                </SheetContent>
              </Sheet>

              {/* Main Content Area - Takes remaining space */}
              <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <ErrorBoundary>
                  <Header onMenuClick={() => setMobileMenuOpen(true)} />
                </ErrorBoundary>
                <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
                  <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </div>
                </main>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </body>
    </html>
  )
}