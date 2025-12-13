'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare,
  Filter,
  Loader2,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react'

interface ApprovalItem {
  id: string
  content: string
  author: { name: string; email: string }
  platforms: string[]
  scheduledAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  mediaUrls?: string[]
}

export default function ApprovalsPage() {
  const [stats, setStats] = useState({ pending: 5, approved: 23, rejected: 2 })
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: '1',
      content: 'Exciting news! We\'re launching our new product next week. Stay tuned for more updates! #ProductLaunch #Innovation',
      author: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      platforms: ['Facebook', 'Instagram', 'Twitter'],
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      content: 'Behind the scenes: Our team working hard to deliver the best experience for our customers. 💪',
      author: { name: 'Mike Chen', email: 'mike@example.com' },
      platforms: ['Instagram', 'LinkedIn'],
      scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      content: 'Customer success story: How @company increased their ROI by 300% using our platform.',
      author: { name: 'Emma Davis', email: 'emma@example.com' },
      platforms: ['LinkedIn', 'Twitter'],
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    }
  ])

  const filteredApprovals = approvals.filter(approval => 
    filter === 'all' || approval.status.toLowerCase() === filter
  )

  const handleApprove = async (id: string) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'APPROVED' as const } : item
    ))
    setStats(prev => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }))
  }

  const handleReject = async (id: string) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'REJECTED' as const } : item
    ))
    setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }))
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-500 mt-1">Review and approve content submissions</p>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-400" />
        {(['all', 'pending', 'approved', 'rejected'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === filterType
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterType}
          </button>
        ))}
      </div>

      {/* Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'pending' && 'Pending Approvals'}
            {filter === 'approved' && 'Approved Content'}
            {filter === 'rejected' && 'Rejected Content'}
            {filter === 'all' && 'All Approvals'}
          </CardTitle>
          <CardDescription>
            {filter === 'pending' && 'Content waiting for your review'}
            {filter === 'approved' && 'Content you have approved'}
            {filter === 'rejected' && 'Content you have rejected'}
            {filter === 'all' && 'All approval requests'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No {filter === 'all' ? '' : filter} approvals found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{approval.author.name}</span>
                        </div>
                        <Badge
                          variant={
                            approval.status === 'APPROVED'
                              ? 'default'
                              : approval.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {approval.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">{approval.content}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Scheduled: {formatDate(approval.scheduledAt)}
                        </span>
                        <span>Created: {formatDate(approval.createdAt)}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {approval.platforms.map((platform, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {approval.status === 'PENDING' && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(approval.id)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}