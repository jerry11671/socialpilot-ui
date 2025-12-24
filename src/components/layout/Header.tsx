'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Bell, Search, HelpCircle, User, LogOut, Menu, Loader2, Check, RefreshCw, Trash2, X, Building2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { useRouter } from 'next/navigation'
import { getMe } from '@/lib/api/users'

const API_BASE_URL = 'https://socialpilot-evimero-backend.onrender.com/api/v1'

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

interface Notification {
  id: string
  title?: string
  message: string
  type?: string
  is_read?: boolean
  read?: boolean
  created_at?: string
  createdAt?: string
}

interface Organization {
  id: string
  name: string
  slug?: string
  owner_id?: string
  owner?: {
    id: string
    name?: string
    email: string
  }
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notificationRef = useRef<HTMLDivElement>(null)
  // Initialize user state - start empty, always fetch from API
  const [currentUser, setCurrentUser] = useState<UserData>({
    name: null,
    email: undefined,
    image: null,
    first_name: undefined,
    last_name: undefined,
  })
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [notificationError, setNotificationError] = useState<string | null>(null)

  // Organizations state
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const orgDropdownRef = useRef<HTMLDivElement>(null)

  // Get auth headers helper
  const getAuthHeaders = useCallback(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    return headers
  }, [])

  // Fetch all notifications from API
  const fetchNotifications = useCallback(async () => {
    setIsLoadingNotifications(true)
    setNotificationError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const result = await response.json().catch(() => null)
      
      if (!response.ok) {
        const errorMessage = result?.message || 'Failed to fetch notifications'
        console.error('Notifications error:', errorMessage)
        setNotificationError(errorMessage)
        return
      }

      // Handle different response formats
      const notificationsList = result?.data || result?.notifications || result || []
      setNotifications(Array.isArray(notificationsList) ? notificationsList : [])
      
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setNotificationError('Network error. Please try again.')
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [getAuthHeaders])

  // Fetch unread notifications count from dedicated endpoint
  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unread/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const result = await response.json().catch(() => null)
      
      if (!response.ok) {
        console.error('Unread notifications error:', result?.message)
        return
      }

      // Handle different response formats
      const unreadList = result?.data || result?.notifications || result || []
      const unreadArray = Array.isArray(unreadList) ? unreadList : []
      setUnreadNotifications(unreadArray)
      
      // Set count from response or calculate from array
      const count = result?.count ?? result?.unread_count ?? unreadArray.length
      setUnreadCount(typeof count === 'number' ? count : 0)
      
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err)
    }
  }, [getAuthHeaders])

  // Mark notification(s) as read
  const markAsRead = useCallback(async (notificationId?: string) => {
    try {
      const body: Record<string, any> = {}
      
      // If notificationId provided, mark single notification
      // Otherwise, mark all as read
      if (notificationId) {
        body.notification_id = notificationId
        body.id = notificationId // Support both field names
      } else {
        body.mark_all = true
        body.all = true // Support both field names
      }

      const response = await fetch(`${API_BASE_URL}/notifications/mark-read`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })

      const result = await response.json().catch(() => null)
      
      if (!response.ok) {
        console.error('Mark as read error:', result?.message)
        return false
      }

      // Update local state optimistically
      if (notificationId) {
        // Mark single notification as read locally
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, is_read: true, read: true } 
              : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } else {
        // Mark all as read locally
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true, read: true }))
        )
        setUnreadCount(0)
        setUnreadNotifications([])
      }

      return true
    } catch (err) {
      console.error('Failed to mark as read:', err)
      return false
    }
  }, [getAuthHeaders])

  // Handle notification click - mark as read and potentially navigate
  const handleNotificationClick = useCallback(async (notification: Notification) => {
    if (!(notification.is_read || notification.read)) {
      await markAsRead(notification.id)
    }
    // Could add navigation logic here if notifications have links
  }, [markAsRead])

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    await markAsRead()
  }, [markAsRead])

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const result = await response.json().catch(() => null)
      
      if (!response.ok) {
        console.error('Delete notification error:', result?.message)
        return false
      }

      // Remove from local state
      const deletedNotification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      // Update unread count if the deleted notification was unread
      if (deletedNotification && !(deletedNotification.is_read || deletedNotification.read)) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }

      return true
    } catch (err) {
      console.error('Failed to delete notification:', err)
      return false
    }
  }, [getAuthHeaders, notifications])

  // Handle delete with confirmation
  const handleDeleteNotification = useCallback(async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation() // Prevent triggering the notification click
    await deleteNotification(notificationId)
  }, [deleteNotification])

  // Fetch organizations (both created by user and where user is a member)
  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const result = await response.json().catch(() => null)
      
      if (response.ok) {
        const orgList = result?.data || result?.organizations || result || []
        // Normalize organization IDs - handle both _id and id fields
        const normalizedOrgs = (Array.isArray(orgList) ? orgList : []).map((org: any) => ({
          ...org,
          id: org.id || org._id || org.organization_id, // Support multiple ID field names
        }))
        setOrganizations(normalizedOrgs)
        
        // Get current org from localStorage or use first org
        const storedOrgId = typeof window !== 'undefined' ? localStorage.getItem('current_org_id') : null
        if (storedOrgId && normalizedOrgs.find((o: Organization) => o.id === storedOrgId)) {
          setCurrentOrgId(storedOrgId)
        } else if (normalizedOrgs.length > 0) {
          // Set first organization as current if none is set
          const firstOrgId = normalizedOrgs[0].id
          setCurrentOrgId(firstOrgId)
          if (typeof window !== 'undefined') {
            localStorage.setItem('current_org_id', firstOrgId)
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err)
    }
  }, [getAuthHeaders])

  // Switch organization
  const handleSwitchOrg = useCallback(async (orgId: string, e?: React.MouseEvent) => {
    // Prevent event propagation if event is provided
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Don't switch if already on this organization
    if (currentOrgId === orgId) {
      setShowOrgDropdown(false)
      return
    }

    try {
      console.log('Switching to organization:', orgId)
      const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/switch`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })

      const result = await response.json().catch(() => null)

      if (response.ok) {
        console.log('Organization switched successfully:', result)
        // Update current org ID
        setCurrentOrgId(orgId)
        if (typeof window !== 'undefined') {
          localStorage.setItem('current_org_id', orgId)
        }
        
        // Update organizations list with the returned organization data if available
        if (result?.data) {
          const orgData = result.data
          // Normalize the ID field
          const normalizedOrg = {
            ...orgData,
            id: orgData.id || orgData._id || orgId,
          }
          
          setOrganizations(prev => {
            const existingIndex = prev.findIndex(o => o.id === orgId)
            if (existingIndex >= 0) {
              // Update existing organization with new data
              const updated = [...prev]
              updated[existingIndex] = { ...updated[existingIndex], ...normalizedOrg }
              return updated
            } else {
              // Add new organization if not in list
              return [...prev, normalizedOrg]
            }
          })
        }
        
        setShowOrgDropdown(false)
        // Refresh the page to load new organization context
        window.location.reload()
      } else {
        const errorMsg = result?.message || result?.error || 'Unknown error'
        console.error('Failed to switch organization:', errorMsg)
        alert(`Failed to switch organization: ${errorMsg}`)
      }
    } catch (err) {
      console.error('Failed to switch organization:', err)
      alert('Network error. Please try again.')
    }
  }, [getAuthHeaders, currentOrgId])

  // Fetch current user profile
  const fetchUser = useCallback(async () => {
    // Check if we have an access token before making the API call
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!accessToken) {
      setIsLoadingUser(false)
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
          } else {
            setCurrentUser({ name: null, email: undefined, image: null, first_name: undefined, last_name: undefined })
          }
        } catch (parseErr) {
          console.error('Failed to parse stored user data:', parseErr)
          setCurrentUser({ name: null, email: undefined, image: null, first_name: undefined, last_name: undefined })
        }
      }
    } finally {
      setIsLoadingUser(false)
    }
  }, [])

  // Get current organization name
  const currentOrg = organizations.find(o => o.id === currentOrgId)
  
  // Get current user ID to check if they created the organization
  const getCurrentUserId = () => {
    if (typeof window === 'undefined') return null
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id || user.user_id
      }
    } catch (err) {
      console.error('Failed to parse user data:', err)
    }
    return null
  }
  
  const currentUserId = getCurrentUserId()
  
  // Check if user is the owner of an organization
  const isOwner = (org: Organization) => {
    if (!currentUserId) return false
    return org.owner_id === currentUserId || org.owner?.id === currentUserId
  }

  // Fetch all notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
    }
  }, [showNotifications, fetchNotifications])

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadNotifications()
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [fetchUnreadNotifications])

  // Fetch user profile on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Fetch user profile on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  // Close org dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false)
      }
    }

    if (showOrgDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOrgDropdown])

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      // Clear tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('yf_auth')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Format notification time
  const formatTime = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
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
              placeholder="Search or speak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-12 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <VoiceInputButton
                onTranscript={(text) => setSearchQuery(text)}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {/* Organization Switcher - Hidden on mobile */}
          <div className="hidden sm:block relative" ref={orgDropdownRef}>
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="max-w-[150px] truncate">
                {currentOrg?.name || 'Select Organization'}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showOrgDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showOrgDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 px-2">Switch Organization</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {organizations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No organizations found
                    </div>
                  ) : (
                    <>
                      {/* Organizations created by user */}
                      {organizations.filter(org => isOwner(org)).length > 0 && (
                        <>
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              My Organizations
                            </p>
                          </div>
                          {organizations
                            .filter(org => isOwner(org))
                            .map((org) => (
                              <button
                                key={org.id}
                                onClick={(e) => handleSwitchOrg(org.id, e)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                                  currentOrgId === org.id ? 'bg-emerald-50' : ''
                                }`}
                                type="button"
                              >
                                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-4 w-4 text-emerald-600" />
                                </div>
                                <span className="flex-1 truncate text-sm font-medium text-gray-900">
                                  {org.name}
                                </span>
                                {currentOrgId === org.id && (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                )}
                              </button>
                            ))}
                        </>
                      )}
                      
                      {/* Organizations user is a member of (but didn't create) */}
                      {organizations.filter(org => !isOwner(org)).length > 0 && (
                        <>
                          {organizations.filter(org => isOwner(org)).length > 0 && (
                            <div className="border-t border-gray-100"></div>
                          )}
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Member Of
                            </p>
                          </div>
                          {organizations
                            .filter(org => !isOwner(org))
                            .map((org) => (
                              <button
                                key={org.id}
                                onClick={(e) => handleSwitchOrg(org.id, e)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                                  currentOrgId === org.id ? 'bg-emerald-50' : ''
                                }`}
                                type="button"
                              >
                                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="flex-1 truncate text-sm font-medium text-gray-900">
                                  {org.name}
                                </span>
                                {currentOrgId === org.id && (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                )}
                              </button>
                            ))}
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowOrgDropdown(false)
                      router.push('/organizations')
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Manage Organizations
                  </button>
                </div>
              </div>
            )}
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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-screen sm:w-96 max-w-[calc(100vw-2rem)]">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-emerald-600 hover:text-emerald-700"
                          onClick={handleMarkAllAsRead}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark all read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={fetchNotifications}
                        disabled={isLoadingNotifications}
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoadingNotifications ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {isLoadingNotifications && notifications.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                      </div>
                    ) : notificationError ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-red-500 mb-2">{notificationError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchNotifications}
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                        <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => {
                          const isUnread = !(notification.is_read || notification.read)
                          return (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                isUnread ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                  isUnread ? 'bg-emerald-500' : 'bg-transparent'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  {notification.title && (
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {notification.title}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatTime(notification.created_at || notification.createdAt)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {isUnread && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(notification.id)
                                      }}
                                      className="p-1 text-gray-400 hover:text-emerald-600 transition-colors rounded hover:bg-emerald-50"
                                      title="Mark as read"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                                    title="Delete notification"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Button
                        variant="ghost"
                        className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        size="sm"
                      >
                        View all notifications
                      </Button>
                    </div>
                  )}
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
          {isLoadingUser ? (
            <div className="flex items-center space-x-2 lg:space-x-3 lg:pl-4 lg:border-l lg:border-gray-200">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="hidden lg:block">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : currentUser?.email ? (
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
                      {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.name || `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || currentUser?.email || 'User'}
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
          ) : null}
        </div>
      </div>
    </header>
  )
}