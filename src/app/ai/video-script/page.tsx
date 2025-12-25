'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Video, Loader2, Copy, Check } from 'lucide-react'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { generateVideoScript } from '@/lib/api/ai'

export default function AIVideoScriptPage() {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('15 seconds')
  const [style, setStyle] = useState('Humorous')
  const [platform, setPlatform] = useState('TikTok')
  const [includeVisualCues, setIncludeVisualCues] = useState(true)
  const [generatedScript, setGeneratedScript] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your video script')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedScript('')

    try {
      const response = await generateVideoScript({
        topic: topic.trim(),
        duration: duration,
        style: style,
        platform: platform,
        includeVisualCues: includeVisualCues,
      })

      if (response.success && response.data) {
        setGeneratedScript(response.data.script || '')
      } else {
        setError(response.error || 'Failed to generate video script. Please try again.')
      }
    } catch (err) {
      console.error('Video script generation error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (generatedScript) {
      try {
        await navigator.clipboard.writeText(generatedScript)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Video Script Generator</h1>
        <p className="text-gray-600">Generate engaging video scripts for your social media content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-emerald-600" />
              Generate Video Script
            </CardTitle>
            <CardDescription>
              Enter your topic and customize the script settings
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
                Topic <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe your video topic or content idea... or use voice input"
                  className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3">
                  <VoiceInputButton
                    onTranscript={(text) => setTopic((prev) => prev ? `${prev} ${text}` : text)}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value="15 seconds">15 seconds</option>
                  <option value="30 seconds">30 seconds</option>
                  <option value="60 seconds">60 seconds</option>
                  <option value="90 seconds">90 seconds</option>
                  <option value="2 minutes">2 minutes</option>
                  <option value="3 minutes">3 minutes</option>
                  <option value="5 minutes">5 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value="Humorous">Humorous</option>
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Educational">Educational</option>
                  <option value="Inspiring">Inspiring</option>
                  <option value="Dramatic">Dramatic</option>
                  <option value="Conversational">Conversational</option>
                </select>
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
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visual Cues</label>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVisualCues}
                      onChange={(e) => setIncludeVisualCues(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      disabled={isGenerating}
                    />
                    <span className="text-sm text-gray-700">Include visual cues</span>
                  </label>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Generate Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Video Script</CardTitle>
            <CardDescription>
              Your AI-generated video script will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedScript ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {generatedScript}
                  </pre>
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
                      Copy Script
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter a topic and click "Generate Script" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

