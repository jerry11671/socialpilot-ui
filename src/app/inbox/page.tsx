'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Reply, Archive, User, Send, Loader2, Search, Filter } from 'lucide-react'

interface Message {
  id: string
  platform: string
  content: string
  authorName?: string
  authorUsername?: string
  authorAvatar?: string
  isRead: boolean
  isArchived: boolean
  sentimentLabel?: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  createdAt: string
  conversationId?: string
  attachments?: Array<{
    url: string
    filename: string
    type?: string
    size?: number
  }>
  assignedTo?: {
    id: string
    name?: string
    email: string
  }
  _count?: {
    replies: number
    internalNotes: number
  }
}

export default function InboxPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [showSavedReplies, setShowSavedReplies] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      platform: 'Facebook',
      content: 'Hi! I love your recent post about the new product launch. When will it be available in stores?',
      authorName: 'Sarah Johnson',
      authorUsername: 'sarah.j',
      isRead: false,
      isArchived: false,
      priority: 'NORMAL',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      _count: { replies: 0, internalNotes: 0 }
    },
    {
      id: '2',
      platform: 'Instagram',
      content: 'Great content! Could you share more details about the pricing?',
      authorName: 'Mike Chen',
      authorUsername: 'mike_c',
      isRead: true,
      isArchived: false,
      priority: 'HIGH',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      _count: { replies: 2, internalNotes: 1 }
    },
    {
      id: '3',
      platform: 'Twitter',
      content: 'Thanks for the quick response to my question yesterday! Excellent customer service.',
      authorName: 'Emma Davis',
      authorUsername: 'emma_d',
      isRead: true,
      isArchived: false,
      priority: 'LOW',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      _count: { replies: 1, internalNotes: 0 }
    }
  ])

  const handleArchive = async () => {
    if (!selectedMessage) return
    // Mock archive functionality
    setSelectedMessage(null)
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim() || isSendingReply) return

    setIsSendingReply(true)
    // Mock reply functionality
    setTimeout(() => {
      setReplyContent('')
      setIsSendingReply(false)
    }, 1000)
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'LOW': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-500 mt-1">Manage messages from all your social accounts</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-12rem)]">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-emerald-50 border-emerald-200' : ''
                    } ${!message.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.authorAvatar ? (
                        <img
                          src={message.authorAvatar}
                          alt={message.authorName || 'User'}
                          className="h-10 w-10 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-emerald-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {message.authorName || message.authorUsername || 'Unknown'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(message.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {message.platform}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </Badge>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.content}
                        </p>
                        {message._count && (message._count.replies > 0 || message._count.internalNotes > 0) && (
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            {message._count.replies > 0 && (
                              <span>{message._count.replies} replies</span>
                            )}
                            {message._count.internalNotes > 0 && (
                              <span>{message._count.internalNotes} notes</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedMessage ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {selectedMessage.authorAvatar ? (
                        <img
                          src={selectedMessage.authorAvatar}
                          alt={selectedMessage.authorName || 'User'}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-emerald-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle>
                          {selectedMessage.authorName || selectedMessage.authorUsername || 'Unknown'}
                        </CardTitle>
                        <CardDescription>
                          {selectedMessage.platform} • {formatTimeAgo(selectedMessage.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleArchive}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>

                {/* Message Tags */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      + Add Tag
                    </Button>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Conversation Thread
                  </h4>
                  <div className="space-y-3">
                    <div className="text-center py-4 text-gray-400">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No replies yet</p>
                    </div>
                  </div>
                </div>

                {/* Reply Box */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reply
                  </label>
                  <div className="space-y-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        AI Suggestions
                      </Button>
                      <Button 
                        onClick={handleSendReply}
                        disabled={!replyContent.trim() || isSendingReply}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isSendingReply ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}