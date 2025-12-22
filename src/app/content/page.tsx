'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { Plus, Calendar, FileText, Sparkles, Image as ImageIcon, Mic } from 'lucide-react'

export default function ContentPage() {
  const [showAICaption, setShowAICaption] = useState(false)
  const [showAIImage, setShowAIImage] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState<'posts' | 'drafts' | 'recurring'>('posts')
  const [selectedDraft, setSelectedDraft] = useState<any>(null)
  const [showDraftEditor, setShowDraftEditor] = useState(false)
  const [showRecurringBuilder, setShowRecurringBuilder] = useState(false)

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Create and manage your social media content</p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          onClick={() => setShowScheduleModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Content Creation Tools */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Post Composer */}
        <Card>
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
            <CardDescription>Compose a new social media post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Select Platforms
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['Facebook', 'Instagram', 'Twitter'].map((platform) => (
                  <button
                    key={platform}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Content
              </label>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Click the mic to use voice input..."
                  className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
                <div className="absolute bottom-3 right-3">
                  <VoiceInputButton
                    onTranscript={(text) => setContent((prev) => prev ? `${prev} ${text}` : text)}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowMediaLibrary(true)} className="flex-1 sm:flex-initial">
                <ImageIcon className="mr-2 h-4 w-4" />
                Add Media
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAICaption(true)} className="flex-1 sm:flex-initial">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Caption
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAIImage(true)} className="flex-1 sm:flex-initial">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Image
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Publish Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Tools */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Use AI to enhance your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowAICaption(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Captions
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowAIImage(true)}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Images
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content List with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl">Your Content</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your published, scheduled, and draft posts</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'posts'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'drafts'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Drafts
              </button>
              <button
                onClick={() => setActiveTab('recurring')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'recurring'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recurring
              </button>
              {activeTab === 'drafts' && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedDraft(null)
                    setShowDraftEditor(true)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Draft
                </Button>
              )}
              {activeTab === 'recurring' && (
                <Button
                  size="sm"
                  onClick={() => setShowRecurringBuilder(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Recurring Post
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'posts' ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No posts yet</p>
              <p className="text-xs mt-1">Create your first post to get started</p>
            </div>
          ) : activeTab === 'drafts' ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No drafts yet</p>
              <p className="text-xs mt-1">Save posts as drafts to work on them later</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recurring posts yet</p>
              <p className="text-xs mt-1">Set up recurring posts to automate your content</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}