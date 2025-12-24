'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'
import { getMe } from '@/lib/api/users'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Search,
  TrendingUp,
  Share2,
  CreditCard,
  Bell,
  CheckCircle2,
  GitBranch,
  Repeat,
  Link2,
  Building2,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Recurring Posts', href: '/recurring', icon: Repeat },
  { name: 'Inbox', href: '/inbox', icon: MessageSquare },
  { name: 'Approvals', href: '/approvals', icon: CheckCircle2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Social Listening', href: '/listening', icon: Search },
  { name: 'AI Assistant', href: '/ai', icon: Sparkles },
  { name: 'Media Library', href: '/media', icon: ImageIcon },
  { name: 'Competitors', href: '/competitors', icon: TrendingUp },
  { name: 'Advocacy', href: '/advocacy', icon: Share2 },
  { name: 'Organizations', href: '/organizations', icon: Building2 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Accounts', href: '/accounts', icon: Link2 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onNavigate?: () => void
}

interface UserData {
  name?: string | null
  email?: string
  image?: string | null
  first_name?: string
  last_name?: string
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<UserData>({
    name: null,
    email: undefined,
    image: null,
    first_name: undefined,
    last_name: undefined,
  })
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Fetch current user profile
  const fetchUser = useCallback(async () => {
    // Check if we have an access token before making the API call
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!accessToken) {
      setIsLoadingUser(false)
      // Try to load from localStorage as fallback
      if (typeof window !== 'undefined') {
        try {
          const storedUserStr = localStorage.getItem('user')
          if (storedUserStr) {
            const storedUser = JSON.parse(storedUserStr)
            setCurrentUser({
              name: storedUser.name || `${storedUser.first_name || ''} ${storedUser.last_name || ''}`.trim() || storedUser.email || null,
              email: storedUser.email,
              image: storedUser.image || null,
              first_name: storedUser.first_name,
              last_name: storedUser.last_name,
            })
          }
        } catch (parseErr) {
          console.error('Failed to parse stored user data:', parseErr)
        }
      }
      return
    }

    setIsLoadingUser(true)
    try {
      const userData = await getMe()
      const userInfo: UserData = {
        name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || null,
        email: userData.email,
        image: userData.image || null,
        first_name: userData.first_name,
        last_name: userData.last_name,
      }
      setCurrentUser(userInfo)
      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      // On error, try to load from localStorage if available
      if (typeof window !== 'undefined') {
        try {
          const storedUserStr = localStorage.getItem('user')
          if (storedUserStr) {
            const storedUser = JSON.parse(storedUserStr)
            setCurrentUser({
              name: storedUser.name || `${storedUser.first_name || ''} ${storedUser.last_name || ''}`.trim() || storedUser.email || null,
              email: storedUser.email,
              image: storedUser.image || null,
              first_name: storedUser.first_name,
              last_name: storedUser.last_name,
            })
          }
        } catch (parseErr) {
          console.error('Failed to parse stored user data:', parseErr)
        }
      }
    } finally {
      setIsLoadingUser(false)
    }
  }, [])

  // Fetch user profile on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.name) {
      const names = currentUser.name.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return currentUser.name.charAt(0).toUpperCase()
    }
    if (currentUser?.first_name && currentUser?.last_name) {
      return `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="flex h-full w-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 sm:h-20 items-center border-b border-gray-200 px-3 sm:px-4 lg:px-6 flex-shrink-0">
        <Logo size="sm" showText={true} className="sm:hidden" />
        <Logo size="md" showText={true} className="hidden sm:block" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 sm:px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt={currentUser?.name || 'User'}
              className="h-10 w-10 rounded-full flex-shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-emerald-700">
                {getUserInitials()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {isLoadingUser ? (
              <>
                <p className="text-sm font-medium text-gray-900 truncate animate-pulse">
                  Loading...
                </p>
                <p className="text-xs text-gray-500 truncate">
                  &nbsp;
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name || 
                   (currentUser?.first_name && currentUser?.last_name 
                     ? `${currentUser.first_name} ${currentUser.last_name}`
                     : currentUser?.first_name || currentUser?.last_name || currentUser?.email || 'User')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || 'No email'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}