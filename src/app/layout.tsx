'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { useState } from 'react'
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

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  )
}