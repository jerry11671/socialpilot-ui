'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Repeat, Calendar, Clock, Edit, Trash2, Play, Pause } from 'lucide-react'

interface RecurringPost {
  id: string
  title: string
  content: string
  platforms: string[]
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    days?: string[]
  }
  status: 'active' | 'paused' | 'draft'
  nextRun: string
  lastRun?: string
  totalRuns: number
}

export default function RecurringPage() {
  const [showBuilder, setShowBuilder] = useState(false)
  const [recurringPosts, setRecurringPosts] = useState<RecurringPost[]>([
    {
      id: '1',
      title: 'Daily Motivation Quote',
      content: 'Start your day with inspiration! 💪 #Motivation #MondayMotivation #Success',
      platforms: ['Facebook', 'Instagram', 'Twitter'],
      schedule: {
        frequency: 'daily',
        time: '09:00',
      },
      status: 'active',
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      totalRuns: 45
    },
    {
      id: '2',
      title: 'Weekly Product Showcase',
      content: 'Feature Friday! Check out our amazing product of the week. What do you think? 🌟',
      platforms: ['Instagram', 'Facebook'],
      schedule: {
        frequency: 'weekly',
        time: '15:00',
        days: ['Friday']
      },
      status: 'active',
      nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      totalRuns: 12
    },
    {
      id: '3',
      title: 'Monthly Newsletter Reminder',
      content: 'Don\'t miss our monthly newsletter! Subscribe now for exclusive updates and offers. 📧',
      platforms: ['LinkedIn', 'Twitter'],
      schedule: {
        frequency: 'monthly',
        time: '10:00',
      },
      status: 'paused',
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      totalRuns: 6
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyText = (schedule: RecurringPost['schedule']) => {
    switch (schedule.frequency) {
      case 'daily':
        return `Daily at ${schedule.time}`
      case 'weekly':
        return `Weekly on ${schedule.days?.join(', ')} at ${schedule.time}`
      case 'monthly':
        return `Monthly at ${schedule.time}`
      default:
        return 'Custom schedule'
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

  const togglePostStatus = (postId: string) => {
    setRecurringPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, status: post.status === 'active' ? 'paused' : 'active' }
          : post
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Recurring Posts</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Automate your content with scheduled recurring posts</p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          onClick={() => setShowBuilder(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Recurring Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {recurringPosts.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {recurringPosts.reduce((sum, post) => sum + post.totalRuns, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Posts published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next Run</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {recurringPosts.filter(p => p.status === 'active').length > 0 ? '2h' : 'None'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Time until next post</p>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recurring Posts</CardTitle>
          <CardDescription>Manage your automated content schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {recurringPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Repeat className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recurring posts yet</p>
              <p className="text-xs mt-1">Create your first recurring post to automate your content</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recurringPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <Badge className={`text-xs ${getStatusColor(post.status)}`}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {getFrequencyText(post.schedule)}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          Next: {formatDate(post.nextRun)}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Repeat className="h-4 w-4 mr-2" />
                          {post.totalRuns} runs
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {post.platforms.map((platform, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePostStatus(post.id)}
                        className={post.status === 'active' ? 'text-yellow-600 hover:text-yellow-700' : 'text-emerald-600 hover:text-emerald-700'}
                      >
                        {post.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {post.lastRun && (
                    <div className="text-xs text-gray-500 border-t pt-3">
                      Last run: {formatDate(post.lastRun)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recurring Post Builder Modal Placeholder */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Recurring Post</CardTitle>
              <CardDescription>Set up automated content posting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                <input
                  type="text"
                  placeholder="Give your recurring post a name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  placeholder="Write your post content..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowBuilder(false)}>
                  Cancel
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Create Recurring Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}