'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, HelpCircle, User, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick?: () => void
}

interface UserData {
  name?: string | null
  email?: string
  image?: string | null
  first_name?: string
  last_name?: string
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [currentUser, setCurrentUser] = useState<UserData>({
    name: 'John Doe',
    email: 'john@example.com',
    image: null,
    first_name: 'John',
    last_name: 'Doe',
  })
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      // Simulate sign out
      setTimeout(() => {
        router.push('/login')
        setIsSigningOut(false)
      }, 1000)
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-3 sm:px-4 lg:px-6 gap-2">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 items-center max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {/* Organization Switcher - Hidden on mobile */}
          <div className="hidden sm:block">
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>My Organization</option>
            </select>
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-600"></span>
            </Button>
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-screen sm:w-80 max-w-[calc(100vw-2rem)]">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Help - Hidden on mobile */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block h-8 w-px bg-gray-200"></div>

          {/* Create Post - Hidden on mobile, icon only on tablet */}
          <Button className="bg-emerald-600 hover:bg-emerald-700 hidden sm:flex">
            <span className="hidden md:inline">Create Post</span>
            <span className="md:hidden">+</span>
          </Button>

          {/* User Menu */}
          {currentUser && !isLoadingUser && (
            <div className="flex items-center space-x-2 lg:space-x-3 lg:pl-4 lg:border-l lg:border-gray-200">
              <div className="flex items-center space-x-2">
                {currentUser?.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser?.name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || ''}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                disabled={isSigningOut}
                title="Sign out"
                className="hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className={`h-4 w-4 ${isSigningOut ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}