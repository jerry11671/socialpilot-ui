'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, TrendingUp, Share2, Heart, MessageCircle, Repeat2, ExternalLink } from 'lucide-react'

export default function AdvocacyPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'profile'>('feed')

  const contentFeed = [
    {
      id: '1',
      title: 'New Product Launch Announcement',
      content: 'We\'re excited to announce our latest product update! Share this with your network to help spread the word.',
      imageUrl: '/placeholder-image.jpg',
      category: 'Product Update',
      points: 50,
      shares: 23,
      likes: 45,
      comments: 12
    },
    {
      id: '2',
      title: 'Company Culture Spotlight',
      content: 'Behind the scenes: Our amazing team working together to deliver exceptional results for our customers.',
      imageUrl: '/placeholder-image.jpg',
      category: 'Culture',
      points: 30,
      shares: 18,
      likes: 67,
      comments: 8
    }
  ]

  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', department: 'Marketing', points: 1250, shares: 45, badge: 'Gold Advocate' },
    { rank: 2, name: 'Mike Chen', department: 'Sales', points: 980, shares: 38, badge: 'Silver Advocate' },
    { rank: 3, name: 'Emma Davis', department: 'Product', points: 875, shares: 32, badge: 'Bronze Advocate' },
    { rank: 4, name: 'John Smith', department: 'Engineering', points: 720, shares: 28, badge: 'Rising Star' },
    { rank: 5, name: 'Lisa Wang', department: 'Customer Success', points: 650, shares: 25, badge: 'Team Player' }
  ]

  const userProfile = {
    name: 'John Doe',
    department: 'Marketing',
    rank: 8,
    totalPoints: 450,
    totalShares: 18,
    badge: 'Rising Star',
    recentActivity: [
      { action: 'Shared product announcement', points: 50, date: '2 hours ago' },
      { action: 'Liked company culture post', points: 10, date: '1 day ago' },
      { action: 'Commented on team achievement', points: 15, date: '2 days ago' }
    ]
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800'
    if (rank === 2) return 'bg-gray-100 text-gray-800'
    if (rank === 3) return 'bg-orange-100 text-orange-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Advocacy</h1>
          <p className="text-gray-500 mt-1">Share approved content and earn rewards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'feed', label: 'Content Feed', icon: Share2 },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'profile', label: 'My Profile', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Content</CardTitle>
                <CardDescription>Share these approved posts to earn advocacy points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contentFeed.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge className="bg-emerald-100 text-emerald-700">
                              {item.points} points
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{item.content}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {item.likes} likes
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {item.comments} comments
                            </span>
                            <span className="flex items-center">
                              <Repeat2 className="h-4 w-4 mr-1" />
                              {item.shares} shares
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share to LinkedIn
                        </Button>
                        <Button variant="outline">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share to Twitter
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advocacy Leaderboard</CardTitle>
                <CardDescription>Top advocates this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((person) => (
                    <div
                      key={person.rank}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                          <span className="text-lg font-bold text-gray-700">#{person.rank}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{person.name}</h3>
                          <p className="text-sm text-gray-500">{person.department}</p>
                        </div>
                        <Badge className={getRankBadgeColor(person.rank)}>
                          {person.badge}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{person.points} pts</p>
                        <p className="text-sm text-gray-500">{person.shares} shares</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>My Stats</CardTitle>
                  <CardDescription>Your advocacy performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Rank</span>
                      <span className="text-2xl font-bold text-gray-900">#{userProfile.rank}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Points</span>
                      <span className="text-2xl font-bold text-emerald-600">{userProfile.totalPoints}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Shares</span>
                      <span className="text-2xl font-bold text-gray-900">{userProfile.totalShares}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <Badge className="bg-blue-100 text-blue-800">
                        {userProfile.badge}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest advocacy actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                        <Badge variant="outline" className="text-emerald-600">
                          +{activity.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rewards & Achievements</CardTitle>
                <CardDescription>Unlock rewards as you earn more points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border border-gray-200 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h3 className="font-semibold text-gray-900">Bronze Badge</h3>
                    <p className="text-sm text-gray-500">100 points</p>
                    <Badge className="mt-2 bg-emerald-100 text-emerald-700">Earned</Badge>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Silver Badge</h3>
                    <p className="text-sm text-gray-500">500 points</p>
                    <Badge variant="outline">50 points to go</Badge>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Gold Badge</h3>
                    <p className="text-sm text-gray-500">1000 points</p>
                    <Badge variant="outline">550 points to go</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}