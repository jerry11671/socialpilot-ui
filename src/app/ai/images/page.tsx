'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Loader2, Download, Sparkles, RefreshCw } from 'lucide-react'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { generateImage } from '@/lib/api/ai'

export default function AIImageGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Vivid')
  const [size, setSize] = useState('1024x1024')
  const [quality, setQuality] = useState('standard')
  const [generatedImage, setGeneratedImage] = useState<{ url: string; revised_prompt: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      const response = await generateImage({
        prompt: prompt.trim(),
        style: style,
        size: size,
        quality: quality,
      })

      if (response.success && response.data) {
        setGeneratedImage({
          url: response.data.image.url,
          revised_prompt: response.data.image.revised_prompt,
        })
      } else {
        setError(response.error || 'Failed to generate image. Please try again.')
      }
    } catch (err) {
      console.error('Image generation error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage?.url) return

    try {
      const response = await fetch(generatedImage.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-generated-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download image:', err)
      setError('Failed to download image. Please try again.')
    }
  }

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
        <p className="text-gray-600">Create stunning images with AI using natural language prompts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
              Generate Image
            </CardTitle>
            <CardDescription>
              Describe the image you want to create and customize the style, size, and quality
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
                Prompt <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate... or use voice input"
                  className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3">
                  <VoiceInputButton
                    onTranscript={(text) => setPrompt((prev) => prev ? `${prev} ${text}` : text)}
                    size="md"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Be as descriptive as possible for best results
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value="Vivid">Vivid</option>
                  <option value="Natural">Natural</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isGenerating}
                >
                  <option value="1024x1024">Square (1024×1024)</option>
                  <option value="1792x1024">Landscape (1792×1024)</option>
                  <option value="1024x1792">Portrait (1024×1792)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isGenerating}
              >
                <option value="standard">Standard</option>
                <option value="hd">HD (Higher quality, slower)</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your AI-generated image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="p-8 text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                <p className="text-gray-600 font-medium">Generating your image...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={generatedImage.url}
                    alt="AI Generated"
                    className="w-full h-auto"
                  />
                </div>
                
                {generatedImage.revised_prompt && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Revised Prompt:</p>
                    <p className="text-sm text-gray-600">{generatedImage.revised_prompt}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  <Button
                    onClick={handleRegenerate}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter a prompt and click "Generate Image" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
