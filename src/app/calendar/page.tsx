'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Clock, FileText, Loader2, Edit, Calendar as CalendarIcon, Copy, History, Trash2, BarChart3, CheckSquare, Square } from 'lucide-react'

interface UpcomingPost {
  id: string
  content: string
  scheduledAt: string
  status: string
  platforms: Array<{ platform: string }>
  user: {
    name?: string
    email: string
  }
}

export default function CalendarPage() {
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showBulkScheduleModal, setShowBulkScheduleModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set())
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [upcomingPosts, setUpcomingPosts] = useState<UpcomingPost[]>([
    {
      id: '1',
      content: 'Just launched our new product! Check it out and let us know what you think. #ProductLaunch #Innovation',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      platforms: [{ platform: 'Facebook' }],
      user: { name: 'John Doe', email: 'john@example.com' }
    },
    {
      id: '2',
      content: 'Behind the scenes of our team working on the next big feature. Stay tuned! 🚀',
      scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      platforms: [{ platform: 'Twitter' }],
      user: { name: 'Jane Smith', email: 'jane@example.com' }
    }
  ])
  const [stats, setStats] = useState({ scheduled: 8, published: 45, failed: 2 })
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingUpcoming, setLoadingUpcoming] = useState(false)

  const handleToggleSelect = (postId: string) => {
    const newSelected = new Set(selectedPostIds)
    if (newSelected.has(postId)) {
      newSelected.delete(postId)
    } else {
      newSelected.add(postId)
    }
    setSelectedPostIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPostIds.size === upcomingPosts.length) {
      setSelectedPostIds(new Set())
    } else {
      setSelectedPostIds(new Set(upcomingPosts.map((p) => p.id)))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Schedule and manage your content</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline"
            onClick={() => setShowBulkScheduleModal(true)}
            className="flex-1 sm:flex-initial text-sm"
          >
            <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Bulk Schedule</span>
            <span className="sm:hidden">Bulk</span>
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-initial text-sm"
            onClick={() => setShowScheduleModal(true)}
          >
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Schedule Post</span>
            <span className="sm:hidden">Schedule</span>
          </Button>
        </div>
      </div>

      {/* Calendar Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Platforms</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>Twitter</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Status</option>
              <option>Scheduled</option>
              <option>Published</option>
              <option>Failed</option>
            </select>
            <input
              type="text"
              placeholder="Search content..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1 min-w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Calendar View Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>Visual calendar will be rendered here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Interactive calendar component</p>
              <p className="text-xs mt-1">Click dates to schedule posts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Posts Summary */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div>
                <CardTitle className="text-lg sm:text-xl">Upcoming This Week</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Next 7 days</CardDescription>
              </div>
              {upcomingPosts.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {isSelectMode && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs h-7 sm:h-8"
                      >
                        {selectedPostIds.size === upcomingPosts.length ? (
                          <>
                            <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Deselect All</span>
                            <span className="sm:hidden">Deselect</span>
                          </>
                        ) : (
                          <>
                            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Select All</span>
                            <span className="sm:hidden">Select All</span>
                          </>
                        )}
                      </Button>
                      {selectedPostIds.size > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowBulkDeleteModal(true)}
                          className="text-xs h-7 sm:h-8"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Delete ({selectedPostIds.size})
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSelectMode(!isSelectMode)
                      if (isSelectMode) {
                        setSelectedPostIds(new Set())
                      }
                    }}
                    className="text-xs h-7 sm:h-8"
                  >
                    {isSelectMode ? 'Cancel' : 'Select'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loadingUpcoming ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : upcomingPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming posts this week</p>
                <p className="text-xs mt-1">Click on the calendar to schedule a post</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                {upcomingPosts.map((post) => {
                  const isSelected = selectedPostIds.has(post.id)
                  return (
                    <div
                      key={post.id}
                      className={`p-2 sm:p-3 border rounded-lg transition-colors ${
                        isSelected ? 'bg-emerald-50 border-emerald-300' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {isSelectMode && (
                          <button
                            onClick={() => handleToggleSelect(post.id)}
                            className="mt-1 flex-shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                            ) : (
                              <Square className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                          </button>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-900 line-clamp-2">{post.content}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
                            <Badge
                              variant={
                                post.status === 'PUBLISHED'
                                  ? 'default'
                                  : post.status === 'SCHEDULED'
                                  ? 'secondary'
                                  : post.status === 'FAILED'
                                  ? 'destructive'
                                  : 'outline'
                              }
                              className="text-xs w-fit"
                            >
                              {post.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(post.scheduledAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 ml-1 sm:ml-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                            title="View version history"
                          >
                            <History className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                            title="Duplicate post"
                          >
                            <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                            title="Edit post"
                          >
                            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete post"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          {post.status === 'PUBLISHED' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="View analytics"
                            >
                              <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.platforms.map((p, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {p.platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Quick Stats</CardTitle>
            <CardDescription className="text-xs sm:text-sm">This month</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loadingStats ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Scheduled</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">{stats.scheduled}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Published</span>
                  <span className="text-base sm:text-lg font-semibold text-emerald-600">{stats.published}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Failed</span>
                  <span className="text-base sm:text-lg font-semibold text-red-600">{stats.failed}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Total</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      {stats.scheduled + stats.published + stats.failed}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}