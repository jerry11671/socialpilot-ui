'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, AlertTriangle, TrendingUp, TrendingDown, Loader2, FileText, Calendar, Mail, Trash2, Edit } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function ListeningPage() {
  const [showKeywordManager, setShowKeywordManager] = useState(false)
  const [stats, setStats] = useState({
    stats: { total: 156, positive: 89, negative: 23, highPriority: 12 },
    platforms: { Facebook: 45, Instagram: 67, Twitter: 44 }
  })
  const [loadingStats, setLoadingStats] = useState(false)
  const [days, setDays] = useState(30)
  const [selectedMention, setSelectedMention] = useState<any>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedMentionId, setSelectedMentionId] = useState<string | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [keywordPerformance, setKeywordPerformance] = useState({
    keywords: [
      {
        keywordId: '1',
        keyword: 'SocialPilot',
        totalMentions: 45,
        avgEngagement: 12.5,
        trend: 15.3,
        trendDirection: 'up',
        highPriority: 3,
        sentimentDistribution: { positive: 67, negative: 18, neutral: 15 }
      },
      {
        keywordId: '2',
        keyword: 'social media management',
        totalMentions: 32,
        avgEngagement: 8.7,
        trend: -5.2,
        trendDirection: 'down',
        highPriority: 1,
        sentimentDistribution: { positive: 45, negative: 25, neutral: 30 }
      }
    ]
  })
  const [loadingKeywords, setLoadingKeywords] = useState(false)
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: '1',
      name: 'Weekly Brand Mentions Report',
      isActive: true,
      format: 'PDF',
      schedule: { frequency: 'weekly' },
      emailRecipients: ['manager@example.com'],
      nextGenerateAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ])
  const [activeTab, setActiveTab] = useState<'overview' | 'archive'>('overview')

  const mentions = [
    {
      id: '1',
      content: 'Just started using SocialPilot and loving the interface! Great tool for managing multiple accounts.',
      author: 'Sarah Johnson',
      platform: 'Twitter',
      sentiment: 'positive',
      priority: 'normal',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      engagement: 15
    },
    {
      id: '2',
      content: 'Having some issues with the scheduling feature. Hope they fix it soon.',
      author: 'Mike Chen',
      platform: 'Facebook',
      sentiment: 'negative',
      priority: 'high',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      engagement: 8
    },
    {
      id: '3',
      content: 'SocialPilot vs other tools - what do you think is the best for small businesses?',
      author: 'Emma Davis',
      platform: 'LinkedIn',
      sentiment: 'neutral',
      priority: 'normal',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      engagement: 23
    }
  ]

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-100 text-emerald-800'
      case 'negative': return 'bg-red-100 text-red-800'
      case 'neutral': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Listening</h1>
          <p className="text-gray-500 mt-1">Monitor mentions and conversations about your brand</p>
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
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowReportBuilder(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowKeywordManager(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Manage Keywords
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats */}
          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { name: 'Total Mentions', value: stats.stats.total, change: `Last ${days}d` },
                { name: 'Positive', value: stats.stats.positive, change: `${((stats.stats.positive / stats.stats.total) * 100 || 0).toFixed(0)}%` },
                { name: 'Negative', value: stats.stats.negative, change: `${((stats.stats.negative / stats.stats.total) * 100 || 0).toFixed(0)}%` },
                { name: 'High Priority', value: stats.stats.highPriority, change: 'Requires attention' },
              ].map((stat) => (
                <Card key={stat.name}>
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value || 0}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.change}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Sentiment Trend Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
              <CardDescription>Sentiment analysis over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sentiment trend chart will be rendered here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Keywords Performance */}
          {keywordPerformance && keywordPerformance.keywords && keywordPerformance.keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Keywords Performance</CardTitle>
                <CardDescription>Most mentioned keywords and their performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingKeywords ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {keywordPerformance.keywords.map((kw: any, index: number) => (
                      <div
                        key={kw.keywordId}
                        className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className="bg-emerald-100 text-emerald-700">#{index + 1}</Badge>
                              <h3 className="font-semibold text-gray-900">{kw.keyword}</h3>
                              {kw.trendDirection === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                              ) : kw.trendDirection === 'down' ? (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              ) : null}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Total Mentions</p>
                                <p className="font-semibold text-gray-900">{kw.totalMentions}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Avg Engagement</p>
                                <p className="font-semibold text-gray-900">
                                  {Math.round(kw.avgEngagement)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Trend</p>
                                <p
                                  className={`font-semibold ${
                                    kw.trend > 0 ? 'text-emerald-600' : kw.trend < 0 ? 'text-red-600' : 'text-gray-600'
                                  }`}
                                >
                                  {kw.trend > 0 ? '+' : ''}
                                  {kw.trend.toFixed(1)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">High Priority</p>
                                <p className="font-semibold text-gray-900">{kw.highPriority}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                              <span>
                                Positive: {kw.sentimentDistribution.positive.toFixed(0)}%
                              </span>
                              <span>
                                Negative: {kw.sentimentDistribution.negative.toFixed(0)}%
                              </span>
                              <span>
                                Neutral: {kw.sentimentDistribution.neutral.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Mentions by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Platform distribution chart</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.platforms).map(([platform, count], index) => (
                    <div key={platform} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-emerald-600" />
                        <span className="text-sm font-medium capitalize">{platform.toLowerCase()}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Mentions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Mentions</CardTitle>
              <CardDescription>Latest conversations about your keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentions.map((mention) => (
                  <div
                    key={mention.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">{mention.author}</span>
                          <Badge variant="outline" className="text-xs">{mention.platform}</Badge>
                          <Badge className={`text-xs ${getSentimentColor(mention.sentiment)}`}>
                            {mention.sentiment}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(mention.priority)}`}>
                            {mention.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{mention.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{formatTimeAgo(mention.createdAt)}</span>
                          <span>Engagement: {mention.engagement}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          Respond
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          {scheduledReports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automated reports that are sent regularly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduledReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <Badge variant={report.isActive ? 'default' : 'outline'}>
                            {report.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{report.format}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.schedule?.frequency || 'N/A'}
                          </span>
                          {report.emailRecipients?.length > 0 && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {report.emailRecipients.length} recipient(s)
                            </span>
                          )}
                          {report.nextGenerateAt && (
                            <span>
                              Next: {new Date(report.nextGenerateAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Archived Mentions</CardTitle>
              <CardDescription>Previously processed mentions and conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No archived mentions yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}