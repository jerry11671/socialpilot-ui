'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Download, Calendar, Loader2, Facebook, Instagram, Twitter, Eye, FileText } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface AnalyticsOverview {
  metrics: {
    reach: { value: number; change: number; formatted: string }
    engagement: { value: number; change: number; formatted: string }
    impressions: { value: number; change: number; formatted: string }
    clicks: { value: number; change: number; formatted: string }
    engagementRate: { value: number; formatted: string }
    clickThroughRate: { value: number; formatted: string }
  }
  postCount: number
}

interface PlatformPerformance {
  platform: string
  posts: number
  engagement: number
  reach: number
  impressions: number
  clicks: number
  engagementRate: string
}

interface TopPost {
  id: string
  platform: string
  content: string
  publishedAt: string
  engagement: number
  reach: number
  engagementRate: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [platformPerformance, setPlatformPerformance] = useState<PlatformPerformance[]>([
    { platform: 'FACEBOOK', posts: 25, engagement: 1250, reach: 15000, impressions: 25000, clicks: 450, engagementRate: '8.3' },
    { platform: 'INSTAGRAM', posts: 18, engagement: 890, reach: 12000, impressions: 18000, clicks: 320, engagementRate: '7.4' },
    { platform: 'TWITTER', posts: 32, engagement: 650, reach: 8500, impressions: 14000, clicks: 280, engagementRate: '7.6' }
  ])
  const [topPosts, setTopPosts] = useState<TopPost[]>([
    {
      id: '1',
      platform: 'FACEBOOK',
      content: 'Just launched our new product! Check it out and let us know what you think. #ProductLaunch #Innovation',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: 245,
      reach: 3200,
      engagementRate: 7.65
    },
    {
      id: '2',
      platform: 'INSTAGRAM',
      content: 'Behind the scenes of our team working on the next big feature. Stay tuned! 🚀',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: 189,
      reach: 2800,
      engagementRate: 6.75
    }
  ])

  useEffect(() => {
    setTimeout(() => {
      setOverview({
        metrics: {
          reach: { value: 125000, change: 12.5, formatted: '125K' },
          engagement: { value: 8500, change: 8.2, formatted: '8.5K' },
          impressions: { value: 450000, change: 15.3, formatted: '450K' },
          clicks: { value: 2800, change: -2.1, formatted: '2.8K' },
          engagementRate: { value: 6.8, formatted: '6.8%' },
          clickThroughRate: { value: 2.3, formatted: '2.3%' }
        },
        postCount: 75
      })
      setLoading(false)
    }, 1000)
  }, [days])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'FACEBOOK':
        return <Facebook className="h-4 w-4" />
      case 'INSTAGRAM':
        return <Instagram className="h-4 w-4" />
      case 'TWITTER':
        return <Twitter className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-2 text-emerald-600 animate-spin" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your social media performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
            <Button
              variant={days === 7 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDays(7)}
              className="text-xs"
            >
              7d
            </Button>
            <Button
              variant={days === 30 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDays(30)}
              className="text-xs"
            >
              30d
            </Button>
            <Button
              variant={days === 90 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDays(90)}
              className="text-xs"
            >
              90d
            </Button>
          </div>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Custom Reports
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="platforms">Platform Dashboards</TabsTrigger>
          <TabsTrigger value="tags">Tag Analytics</TabsTrigger>
          <TabsTrigger value="inbox">Inbox Analytics</TabsTrigger>
          <TabsTrigger value="followers">Follower Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          {overview && (
            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  name: 'Total Reach',
                  value: overview.metrics.reach.formatted,
                  change: overview.metrics.reach.change,
                  icon: TrendingUp,
                },
                {
                  name: 'Engagement',
                  value: overview.metrics.engagement.formatted,
                  change: overview.metrics.engagement.change,
                  icon: TrendingUp,
                },
                {
                  name: 'Impressions',
                  value: overview.metrics.impressions.formatted,
                  change: overview.metrics.impressions.change,
                  icon: TrendingUp,
                },
                {
                  name: 'Clicks',
                  value: overview.metrics.clicks.formatted,
                  change: overview.metrics.clicks.change,
                  icon: TrendingUp,
                },
              ].map((metric) => (
                <Card key={metric.name}>
                  <CardHeader className="pb-2">
                    <CardDescription>{metric.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div
                      className={`flex items-center text-sm mt-1 ${
                        metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {metric.change >= 0 ? '+' : ''}
                      {metric.change.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Charts Placeholder */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Over Time</CardTitle>
                <CardDescription>Last {days} days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Engagement chart will be rendered here</p>
                    <p className="text-xs mt-1">Using Recharts for visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Engagement by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Platform chart will be rendered here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Distribution */}
          {platformPerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Engagement share by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Pie chart will be rendered here</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {platformPerformance.map((platform, index) => (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded bg-emerald-600" />
                          <span className="text-sm font-medium">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{platform.engagement.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            {platform.engagementRate}% engagement rate
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your best content in the last {days} days</CardDescription>
            </CardHeader>
            <CardContent>
              {topPosts.length > 0 ? (
                <div className="space-y-4">
                  {topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-emerald-600">#{index + 1}</span>
                          <div className="flex items-center space-x-1">
                            {getPlatformIcon(post.platform)}
                            <span className="text-xs text-gray-500">{post.platform}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Reach: {post.reach.toLocaleString()}</span>
                          <span>Engagement Rate: {post.engagementRate.toFixed(2)}%</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {post.engagement.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No posts found for this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform-Specific Dashboards</CardTitle>
              <CardDescription>View detailed analytics for each platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformPerformance.map((platform) => (
                  <Card key={platform.platform} className="hover:border-emerald-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getPlatformIcon(platform.platform)}
                        {platform.platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Posts:</span>
                          <span className="font-medium">{platform.posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Engagement:</span>
                          <span className="font-medium">{platform.engagement.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Engagement Rate:</span>
                          <span className="font-medium">{platform.engagementRate}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Tag Analytics</CardTitle>
              <CardDescription>Performance metrics for your hashtags and tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Tag analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle>Inbox Analytics</CardTitle>
              <CardDescription>Response times and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Inbox analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
              <CardDescription>Track your audience growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Follower growth chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Deep dive into your performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Advanced analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}