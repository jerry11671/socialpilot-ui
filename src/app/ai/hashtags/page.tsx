'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Hash, Loader2, Copy, Check } from 'lucide-react'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { generateHashtags } from '@/lib/api/ai'

export default function AIHashtagGeneratorPage() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [count, setCount] = useState(10)
  const [includeTrending, setIncludeTrending] = useState(true)
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter content for hashtag generation')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedHashtags([])

    try {
      const response = await generateHashtags({
        content: content.trim(),
        platform: platform,
        count: count,
        includeTrending: includeTrending,
      })

      if (response.success && response.data) {
        setGeneratedHashtags(response.data.hashtags || [])
      } else {
        setError(response.error || 'Failed to generate hashtags. Please try again.')
      }
    } catch (err) {
      console.error('Hashtag generation error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (generatedHashtags.length > 0) {
      const hashtagsText = generatedHashtags.join(' ')
      try {
        await navigator.clipboard.writeText(hashtagsText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleCopyHashtag = async (hashtag: string) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Hashtag Generator</h1>
        <p className="text-gray-600">Generate relevant hashtags for your social media content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-emerald-600" />
              Generate Hashtags
            </CardTitle>
            <CardDescription>
              Enter your content and customize hashtag generation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your post content, description, or message... or use voice input"
                  className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3">
                  <VoiceInputButton
                    onTranscript={(text) => setContent((prev) => prev ? `${prev} ${text}` : text)}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Pinterest">Pinterest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value={5}>5 hashtags</option>
                  <option value={10}>10 hashtags</option>
                  <option value={15}>15 hashtags</option>
                  <option value={20}>20 hashtags</option>
                  <option value={30}>30 hashtags</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTrending}
                  onChange={(e) => setIncludeTrending(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  disabled={isGenerating}
                />
                <span className="text-sm font-medium text-gray-700">Include trending hashtags</span>
              </label>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !content.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Hash className="mr-2 h-4 w-4" />
                  Generate Hashtags
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Hashtags</CardTitle>
            <CardDescription>
              Your AI-generated hashtags will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedHashtags.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => handleCopyHashtag(hashtag)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200"
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Click any hashtag to copy it individually</p>
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All Hashtags
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Hash className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter content and click "Generate Hashtags" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
