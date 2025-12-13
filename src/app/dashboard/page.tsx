'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [pendingApprovals, setPendingApprovals] = useState(3)
  const [unreadMessages, setUnreadMessages] = useState(12)
  const [scheduledCount, setScheduledCount] = useState(8)
  const [mentionsAlerts, setMentionsAlerts] = useState(2)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const dashboardStats = [
    { name: 'Total Reach', value: '125K', change: '+12.5%', changeType: 'increase', icon: TrendingUp },
    { name: 'Engagement', value: '8.5K', change: '+8.2%', changeType: 'increase', icon: Users },
    { name: 'Unread Messages', value: formatNumber(unreadMessages), change: `${unreadMessages} new`, changeType: 'increase', icon: MessageSquare },
    { name: 'Scheduled Posts', value: scheduledCount.toString(), change: `${scheduledCount} upcoming`, changeType: 'neutral', icon: Calendar },
  ]

  return (
    <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Welcome back! Here's what's happening with your social media.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto flex-shrink-0">
          <Sparkles className="mr-2 h-4 w-4" />
          Create with AI
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : (
          dashboardStats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.changeType === 'increase' ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-emerald-600 mr-1" />
                    <span className="text-emerald-600">{stat.change}</span>
                  </>
                ) : stat.changeType === 'decrease' ? (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-red-600">{stat.change}</span>
                  </>
                ) : (
                  <span className="text-gray-500">{stat.change}</span>
                )}
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {(pendingApprovals > 0 || mentionsAlerts > 0) && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {pendingApprovals > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-amber-100 p-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">
                        {pendingApprovals} Pending Approval{pendingApprovals !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-amber-700">Posts waiting for your review</p>
                    </div>
                  </div>
                  <Link href="/approvals">
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      Review
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {mentionsAlerts > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-900">
                        {mentionsAlerts} Mention Alert{mentionsAlerts !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-red-700">Requires your attention</p>
                    </div>
                  </div>
                  <Link href="/listening">
                    <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 w-full">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest social media activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">Facebook</span>
                    <Badge variant="default" className="text-xs">PUBLISHED</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">Just launched our new product! Check it out and let us know what you think. #ProductLaunch #Innovation</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      65
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/calendar">
              <Button variant="outline" className="w-full mt-4">
                View All Posts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/calendar">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Post
              </Button>
            </Link>
            <Link href="/ai">
              <Button className="w-full justify-start" variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </Link>
            <Link href="/inbox">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Inbox
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/analytics">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>All activity across your social media accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Post published on Facebook</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New comment on LinkedIn post</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Last 30 days engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart will be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}