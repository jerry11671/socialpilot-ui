'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, Loader2, Copy, Check } from 'lucide-react'
import { generateContentIdeas } from '@/lib/api/ai'

export default function AIContentIdeasPage() {
  const [industry, setIndustry] = useState('Fitness')
  const [count, setCount] = useState(10)
  const [targetAudience, setTargetAudience] = useState('')
  const [contentType, setContentType] = useState('Mixed')
  const [generatedIdeas, setGeneratedIdeas] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!industry.trim()) {
      setError('Please select an industry')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedIdeas('')

    try {
      const response = await generateContentIdeas({
        industry: industry.trim(),
        count: count,
        targetAudience: targetAudience.trim() || '',
        contentType: contentType,
      })

      if (response.success && response.data) {
        setGeneratedIdeas(response.data.ideas || '')
      } else {
        setError(response.error || 'Failed to generate content ideas. Please try again.')
      }
    } catch (err) {
      console.error('Content ideas generation error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (generatedIdeas) {
      try {
        await navigator.clipboard.writeText(generatedIdeas)
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
        <h1 className="text-2xl font-bold text-gray-900">AI Content Ideas Generator</h1>
        <p className="text-gray-600">Generate creative content ideas for your social media posts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-emerald-600" />
              Generate Content Ideas
            </CardTitle>
            <CardDescription>
              Specify your industry and target audience to get personalized content ideas
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
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isGenerating}
              >
                <option value="Fitness">Fitness</option>
                <option value="Technology">Technology</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Fashion">Fashion</option>
                <option value="Travel">Travel</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Beauty">Beauty</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value={5}>5 ideas</option>
                  <option value={10}>10 ideas</option>
                  <option value={15}>15 ideas</option>
                  <option value={20}>20 ideas</option>
                  <option value={25}>25 ideas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Educational">Educational</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Promotional">Promotional</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                  <option value="User Generated">User Generated</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Young professionals, Parents, Students"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isGenerating}
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple audiences with commas
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !industry.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content Ideas</CardTitle>
            <CardDescription>
              Your AI-generated content ideas will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedIdeas ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {generatedIdeas}
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
                      Copy Ideas
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select your industry and click "Generate Ideas" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

