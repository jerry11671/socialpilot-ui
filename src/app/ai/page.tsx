'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { FileText, Image as ImageIcon, Hash, Video, Lightbulb, Target, Shuffle, Brain, Sparkles, Wand2, Loader2, Download, RefreshCw, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { generateImage, generateVideoScript, generateCTAs, generateVariations, generateCaption, generateHashtags } from '@/lib/api/ai'

export default function AIPage() {
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Input states for voice input support
  const [captionInput, setCaptionInput] = useState('')
  const [captionTone, setCaptionTone] = useState('professional')
  const [captionLength, setCaptionLength] = useState('medium')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)
  const [captionError, setCaptionError] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)
  const [hashtagInput, setHashtagInput] = useState('')
  const [hashtagPlatform, setHashtagPlatform] = useState('Instagram')
  const [hashtagCount, setHashtagCount] = useState(10)
  const [includeTrending, setIncludeTrending] = useState(true)
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false)
  const [hashtagError, setHashtagError] = useState('')
  const [hashtagCopied, setHashtagCopied] = useState(false)
  const [ideasInput, setIdeasInput] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStyle, setImageStyle] = useState('Vivid')
  const [imageSize, setImageSize] = useState('1024x1024')
  const [imageQuality, setImageQuality] = useState('standard')
  const [generatedImage, setGeneratedImage] = useState<{ url: string; revised_prompt: string } | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  
  // Video Script states
  const [videoTopic, setVideoTopic] = useState('')
  const [videoDuration, setVideoDuration] = useState('15 seconds')
  const [videoStyle, setVideoStyle] = useState('Humorous')
  const [videoPlatform, setVideoPlatform] = useState('TikTok')
  const [includeVisualCues, setIncludeVisualCues] = useState(true)
  const [generatedVideoScript, setGeneratedVideoScript] = useState('')
  const [isGeneratingVideoScript, setIsGeneratingVideoScript] = useState(false)
  const [videoScriptError, setVideoScriptError] = useState('')
  const [videoScriptCopied, setVideoScriptCopied] = useState(false)
  
  // CTA states
  const [ctaContent, setCtaContent] = useState('')
  const [ctaPlatform, setCtaPlatform] = useState('Instagram')
  const [ctaCount, setCtaCount] = useState(5)
  const [ctaGoal, setCtaGoal] = useState('Drive sales')
  const [generatedCTAs, setGeneratedCTAs] = useState('')
  const [isGeneratingCTAs, setIsGeneratingCTAs] = useState(false)
  const [ctaError, setCtaError] = useState('')
  const [ctaCopied, setCtaCopied] = useState(false)
  
  // Variations states
  const [variationsContent, setVariationsContent] = useState('')
  const [variationsPlatform, setVariationsPlatform] = useState('Facebook')
  const [variationsCount, setVariationsCount] = useState(3)
  const [variationTypes, setVariationTypes] = useState<string[]>(['Tone', 'Length', 'CTA'])
  const [generatedVariations, setGeneratedVariations] = useState('')
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false)
  const [variationsError, setVariationsError] = useState('')
  const [variationsCopied, setVariationsCopied] = useState(false)

  const handleGenerate = (type: string) => {
    setIsGenerating(true)
    // Mock generation
    setTimeout(() => {
      switch (type) {
        case 'caption':
          setGeneratedContent('🚀 Exciting news! We\'re thrilled to announce the launch of our revolutionary new product that will transform the way you work. Join thousands of satisfied customers who have already experienced the difference. #Innovation #ProductLaunch #GameChanger')
          break
        case 'hashtags':
          setGeneratedContent('#Innovation #TechNews #ProductLaunch #StartupLife #DigitalTransformation #BusinessGrowth #TechTrends #Entrepreneurship #Success #Motivation')
          break
        case 'ideas':
          setGeneratedContent('1. Behind-the-scenes content showing your team at work\n2. Customer success stories and testimonials\n3. Industry tips and best practices\n4. Product tutorials and how-to guides\n5. Company culture and values showcase')
          break
        default:
          setGeneratedContent('AI-generated content will appear here...')
      }
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-500 mt-1">Leverage AI to create amazing content</p>
      </div>

      {/* AI Tools Tabs */}
      <Tabs defaultValue="captions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="captions" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Captions</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="flex items-center space-x-2">
            <Hash className="h-4 w-4" />
            <span className="hidden sm:inline">Hashtags</span>
          </TabsTrigger>
          <TabsTrigger value="video-script" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Video Script</span>
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Ideas</span>
          </TabsTrigger>
          <TabsTrigger value="cta" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">CTAs</span>
          </TabsTrigger>
          <TabsTrigger value="variations" className="flex items-center space-x-2">
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Variations</span>
          </TabsTrigger>
          <TabsTrigger value="brand-voice" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Brand Voice</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="captions" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-emerald-600" />
                  AI Caption Generator
                </CardTitle>
                <CardDescription>Generate engaging captions for your social media posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {captionError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {captionError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={captionInput}
                      onChange={(e) => setCaptionInput(e.target.value)}
                      placeholder="Describe your post content, product, or message... or use voice input"
                      className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      disabled={isGeneratingCaption}
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setCaptionInput((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Describe what your post is about
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select
                      value={captionTone}
                      onChange={(e) => setCaptionTone(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingCaption}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="exciting">Exciting</option>
                      <option value="informative">Informative</option>
                      <option value="humorous">Humorous</option>
                      <option value="inspiring">Inspiring</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                    <select
                      value={captionLength}
                      onChange={(e) => setCaptionLength(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingCaption}
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={async () => {
                    if (!captionInput.trim()) {
                      setCaptionError('Please enter a topic for your caption')
                      return
                    }

                    setIsGeneratingCaption(true)
                    setCaptionError('')
                    setGeneratedCaption('')

                    try {
                      const response = await generateCaption({
                        topic: captionInput.trim(),
                        tone: captionTone,
                        length: captionLength,
                      })

                      if (response.success && response.data) {
                        setGeneratedCaption(response.data.caption || '')
                      } else {
                        setCaptionError(response.error || 'Failed to generate caption. Please try again.')
                      }
                    } catch (err) {
                      console.error('Caption generation error:', err)
                      setCaptionError('Network error. Please check your connection and try again.')
                    } finally {
                      setIsGeneratingCaption(false)
                    }
                  }}
                  disabled={isGeneratingCaption || !captionInput.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingCaption ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Caption
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Caption</CardTitle>
                <CardDescription>Your AI-generated caption will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingCaption ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Generating caption...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                ) : generatedCaption ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">{generatedCaption}</p>
                    </div>
                    <Button
                      onClick={async () => {
                        if (generatedCaption) {
                          try {
                            await navigator.clipboard.writeText(generatedCaption)
                            setCaptionCopied(true)
                            setTimeout(() => setCaptionCopied(false), 2000)
                          } catch (err) {
                            console.error('Failed to copy:', err)
                          }
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {captionCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Caption
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Enter a topic and click "Generate Caption" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5 text-emerald-600" />
                AI Image Generator
              </CardTitle>
              <CardDescription>Create stunning images with DALL-E</CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                {imageError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {imageError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate... or use voice input"
                      className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      disabled={isGeneratingImage}
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setImagePrompt((prev) => prev ? `${prev} ${text}` : text)}
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
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingImage}
                    >
                      <option value="Vivid">Vivid</option>
                      <option value="Natural">Natural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingImage}
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
                    value={imageQuality}
                    onChange={(e) => setImageQuality(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    disabled={isGeneratingImage}
                  >
                    <option value="standard">Standard</option>
                    <option value="hd">HD (Higher quality, slower)</option>
                  </select>
                </div>

                <Button
                  onClick={async () => {
                    if (!imagePrompt.trim()) {
                      setImageError('Please enter a prompt for image generation')
                      return
                    }

                    setIsGeneratingImage(true)
                    setImageError('')
                    setGeneratedImage(null)

                    try {
                      const response = await generateImage({
                        prompt: imagePrompt.trim(),
                        style: imageStyle,
                        size: imageSize,
                        quality: imageQuality,
                      })

                      if (response.success && response.data) {
                        setGeneratedImage({
                          url: response.data.image.url,
                          revised_prompt: response.data.image.revised_prompt,
                        })
                      } else {
                        setImageError(response.error || 'Failed to generate image. Please try again.')
                      }
                    } catch (err) {
                      console.error('Image generation error:', err)
                      setImageError('Network error. Please check your connection and try again.')
                    } finally {
                      setIsGeneratingImage(false)
                    }
                  }}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingImage ? (
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

            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>
                  Your AI-generated image will appear here
                </CardDescription>
              </CardHeader>
            <CardContent>
                {isGeneratingImage ? (
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
                        onClick={async () => {
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
                            setImageError('Failed to download image. Please try again.')
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!imagePrompt.trim()) return
                          setIsGeneratingImage(true)
                          setImageError('')
                          setGeneratedImage(null)

                          try {
                            const response = await generateImage({
                              prompt: imagePrompt.trim(),
                              style: imageStyle,
                              size: imageSize,
                              quality: imageQuality,
                            })

                            if (response.success && response.data) {
                              setGeneratedImage({
                                url: response.data.image.url,
                                revised_prompt: response.data.image.revised_prompt,
                              })
                            } else {
                              setImageError(response.error || 'Failed to generate image. Please try again.')
                            }
                          } catch (err) {
                            console.error('Image generation error:', err)
                            setImageError('Network error. Please check your connection and try again.')
                          } finally {
                            setIsGeneratingImage(false)
                          }
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Enter a prompt and click "Generate Image" to get started</p>
              </div>
                )}
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="mr-2 h-5 w-5 text-emerald-600" />
                  AI Hashtag Generator
                </CardTitle>
                <CardDescription>Generate relevant hashtags for better reach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hashtagError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {hashtagError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      placeholder="Enter your post content or relevant keywords... or use voice input"
                      className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      disabled={isGeneratingHashtags}
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setHashtagInput((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Provide the content for which you want hashtag suggestions
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select
                      value={hashtagPlatform}
                      onChange={(e) => setHashtagPlatform(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingHashtags}
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
                      value={hashtagCount}
                      onChange={(e) => setHashtagCount(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingHashtags}
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
                      disabled={isGeneratingHashtags}
                    />
                    <span className="text-sm font-medium text-gray-700">Include trending hashtags</span>
                  </label>
                </div>

                <Button 
                  onClick={async () => {
                    if (!hashtagInput.trim()) {
                      setHashtagError('Please enter content for hashtag generation')
                      return
                    }

                    setIsGeneratingHashtags(true)
                    setHashtagError('')
                    setGeneratedHashtags([])

                    try {
                      const response = await generateHashtags({
                        content: hashtagInput.trim(),
                        platform: hashtagPlatform,
                        count: hashtagCount,
                        includeTrending: includeTrending,
                      })

                      if (response.success && response.data) {
                        setGeneratedHashtags(response.data.hashtags || [])
                      } else {
                        setHashtagError(response.error || 'Failed to generate hashtags. Please try again.')
                      }
                    } catch (err) {
                      console.error('Hashtag generation error:', err)
                      setHashtagError('Network error. Please check your connection and try again.')
                    } finally {
                      setIsGeneratingHashtags(false)
                    }
                  }}
                  disabled={isGeneratingHashtags || !hashtagInput.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingHashtags ? (
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

            <Card>
              <CardHeader>
                <CardTitle>Generated Hashtags</CardTitle>
                <CardDescription>Trending and relevant hashtags for your content</CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingHashtags ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Generating hashtags...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                ) : generatedHashtags.length > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {generatedHashtags.map((hashtag, index) => (
                          <button
                            key={index}
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(hashtag)
                                setHashtagCopied(true)
                                setTimeout(() => setHashtagCopied(false), 2000)
                              } catch (err) {
                                console.error('Failed to copy:', err)
                              }
                            }}
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
                      onClick={async () => {
                        if (generatedHashtags.length > 0) {
                          const hashtagsText = generatedHashtags.join(' ')
                          try {
                            await navigator.clipboard.writeText(hashtagsText)
                            setHashtagCopied(true)
                            setTimeout(() => setHashtagCopied(false), 2000)
                          } catch (err) {
                            console.error('Failed to copy:', err)
                          }
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {hashtagCopied ? (
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
                  <div className="text-center py-8 text-gray-400">
                    <Hash className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Enter content and click "Generate Hashtags" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="video-script" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5 text-emerald-600" />
                  AI Video Script Generator
                </CardTitle>
                <CardDescription>Create engaging video scripts for your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoScriptError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {videoScriptError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={videoTopic}
                      onChange={(e) => setVideoTopic(e.target.value)}
                      placeholder="Describe the video topic or concept... or use voice input"
                      className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      disabled={isGeneratingVideoScript}
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setVideoTopic((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Be specific about what your video should cover
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <select
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingVideoScript}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select
                      value={videoPlatform}
                      onChange={(e) => setVideoPlatform(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingVideoScript}
                    >
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram Reels">Instagram Reels</option>
                      <option value="YouTube Shorts">YouTube Shorts</option>
                      <option value="Facebook">Facebook</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <select
                    value={videoStyle}
                    onChange={(e) => setVideoStyle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    disabled={isGeneratingVideoScript}
                  >
                    <option value="Humorous">Humorous</option>
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Educational">Educational</option>
                    <option value="Inspirational">Inspirational</option>
                    <option value="Dramatic">Dramatic</option>
                    <option value="Friendly">Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVisualCues}
                      onChange={(e) => setIncludeVisualCues(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      disabled={isGeneratingVideoScript}
                    />
                    <span className="text-sm font-medium text-gray-700">Include visual cues and scene descriptions</span>
                  </label>
                </div>

                <Button
                  onClick={async () => {
                    if (!videoTopic.trim()) {
                      setVideoScriptError('Please enter a topic for your video script')
                      return
                    }

                    setIsGeneratingVideoScript(true)
                    setVideoScriptError('')
                    setGeneratedVideoScript('')

                    try {
                      const response = await generateVideoScript({
                        topic: videoTopic.trim(),
                        duration: videoDuration,
                        style: videoStyle,
                        platform: videoPlatform,
                        includeVisualCues: includeVisualCues,
                      })

                      if (response.success && response.data) {
                        setGeneratedVideoScript(response.data.script || '')
                      } else {
                        setVideoScriptError(response.error || 'Failed to generate video script. Please try again.')
                      }
                    } catch (err) {
                      console.error('Video script generation error:', err)
                      setVideoScriptError('Network error. Please check your connection and try again.')
                    } finally {
                      setIsGeneratingVideoScript(false)
                    }
                  }}
                  disabled={isGeneratingVideoScript || !videoTopic.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingVideoScript ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Generate Video Script
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Video Script</CardTitle>
                <CardDescription>
                  Your AI-generated video script will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingVideoScript ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Generating your video script...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                ) : generatedVideoScript ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{generatedVideoScript}</pre>
                    </div>
                    
                    <Button
                      onClick={async () => {
                        if (generatedVideoScript) {
                          try {
                            await navigator.clipboard.writeText(generatedVideoScript)
                            setVideoScriptCopied(true)
                            setTimeout(() => setVideoScriptCopied(false), 2000)
                          } catch (err) {
                            console.error('Failed to copy:', err)
                          }
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {videoScriptCopied ? (
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
                  <div className="text-center py-8 text-gray-400">
                    <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Enter a topic and click "Generate Video Script" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-emerald-600" />
                  AI Content Ideas Generator
                </CardTitle>
                <CardDescription>Get fresh content ideas for your social media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your business
                  </label>
                  <div className="relative">
                    <textarea
                      value={ideasInput}
                      onChange={(e) => setIdeasInput(e.target.value)}
                      placeholder="Describe your business, target audience, and goals... or use voice input"
                      className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setIdeasInput((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none">
                    <option>Educational</option>
                    <option>Promotional</option>
                    <option>Behind-the-scenes</option>
                    <option>User-generated</option>
                    <option>Trending topics</option>
                  </select>
                </div>
                <Button 
                  onClick={() => handleGenerate('ideas')}
                  disabled={isGenerating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="mr-2 h-4 w-4 animate-spin" />
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

            <Card>
              <CardHeader>
                <CardTitle>Content Ideas</CardTitle>
                <CardDescription>Fresh ideas for your next posts</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent && generatedContent.includes('1.') ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Save Ideas
                      </Button>
                      <Button variant="outline" size="sm">
                        Generate More
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Content ideas will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cta" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-emerald-600" />
                  AI CTA Suggestions
                </CardTitle>
                <CardDescription>Generate compelling call-to-action phrases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ctaError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {ctaError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={ctaContent}
                      onChange={(e) => setCtaContent(e.target.value)}
                      placeholder="Enter your post content or message... or use voice input"
                      className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      disabled={isGeneratingCTAs}
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setCtaContent((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Provide the content for which you want CTA suggestions
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select
                      value={ctaPlatform}
                      onChange={(e) => setCtaPlatform(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingCTAs}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                    <select
                      value={ctaCount}
                      onChange={(e) => setCtaCount(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingCTAs}
                    >
                      <option value={3}>3 CTAs</option>
                      <option value={5}>5 CTAs</option>
                      <option value={10}>10 CTAs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                  <select
                    value={ctaGoal}
                    onChange={(e) => setCtaGoal(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    disabled={isGeneratingCTAs}
                  >
                    <option value="Drive sales">Drive sales</option>
                    <option value="Increase engagement">Increase engagement</option>
                    <option value="Get sign-ups">Get sign-ups</option>
                    <option value="Download app">Download app</option>
                    <option value="Visit website">Visit website</option>
                    <option value="Learn more">Learn more</option>
                    <option value="Subscribe">Subscribe</option>
                    <option value="Share content">Share content</option>
                  </select>
                </div>

                <Button
                  onClick={async () => {
                    if (!ctaContent.trim()) {
                      setCtaError('Please enter content for CTA generation')
                      return
                    }

                    setIsGeneratingCTAs(true)
                    setCtaError('')
                    setGeneratedCTAs('')

                    try {
                      const response = await generateCTAs({
                        content: ctaContent.trim(),
                        platform: ctaPlatform,
                        count: ctaCount,
                        goal: ctaGoal,
                      })

                      if (response.success && response.data) {
                        setGeneratedCTAs(response.data.ctas || '')
                      } else {
                        setCtaError(response.error || 'Failed to generate CTAs. Please try again.')
                      }
                    } catch (err) {
                      console.error('CTA generation error:', err)
                      setCtaError('Network error. Please check your connection and try again.')
                    } finally {
                      setIsGeneratingCTAs(false)
                    }
                  }}
                  disabled={isGeneratingCTAs || !ctaContent.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingCTAs ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Generate CTAs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated CTAs</CardTitle>
                <CardDescription>
                  Your AI-generated call-to-action suggestions will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingCTAs ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Generating CTAs...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                ) : generatedCTAs ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{generatedCTAs}</pre>
                    </div>
                    
                    <Button
                      onClick={async () => {
                        if (generatedCTAs) {
                          try {
                            await navigator.clipboard.writeText(generatedCTAs)
                            setCtaCopied(true)
                            setTimeout(() => setCtaCopied(false), 2000)
                          } catch (err) {
                            console.error('Failed to copy:', err)
                          }
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {ctaCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy CTAs
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Enter content and click "Generate CTAs" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="variations" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shuffle className="mr-2 h-5 w-5 text-emerald-600" />
                  AI Content Variations
                </CardTitle>
                <CardDescription>Create multiple versions of your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {variationsError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {variationsError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={variationsContent}
                      onChange={(e) => setVariationsContent(e.target.value)}
                      placeholder="Enter your content to create variations... or use voice input"
                      className="w-full h-32 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      disabled={isGeneratingVariations}
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setVariationsContent((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Provide the content you want to create variations for
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select
                      value={variationsPlatform}
                      onChange={(e) => setVariationsPlatform(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingVariations}
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter">Twitter</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                    <select
                      value={variationsCount}
                      onChange={(e) => setVariationsCount(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      disabled={isGeneratingVariations}
                    >
                      <option value={3}>3 variations</option>
                      <option value={5}>5 variations</option>
                      <option value={10}>10 variations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variation Types</label>
                  <div className="space-y-2">
                    {['Tone', 'Length', 'CTA', 'Format', 'Style'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variationTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVariationTypes([...variationTypes, type])
                            } else {
                              setVariationTypes(variationTypes.filter(t => t !== type))
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          disabled={isGeneratingVariations}
                        />
                        <span className="text-sm font-medium text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                  {variationTypes.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">Please select at least one variation type</p>
                  )}
                </div>

                <Button
                  onClick={async () => {
                    if (!variationsContent.trim()) {
                      setVariationsError('Please enter content for variation generation')
                      return
                    }

                    if (variationTypes.length === 0) {
                      setVariationsError('Please select at least one variation type')
                      return
                    }

                    setIsGeneratingVariations(true)
                    setVariationsError('')
                    setGeneratedVariations('')

                    try {
                      const response = await generateVariations({
                        content: variationsContent.trim(),
                        platform: variationsPlatform,
                        count: variationsCount,
                        variationTypes: variationTypes,
                      })

                      if (response.success && response.data) {
                        setGeneratedVariations(response.data.variations || '')
                      } else {
                        setVariationsError(response.error || 'Failed to generate variations. Please try again.')
                      }
                    } catch (err) {
                      console.error('Variations generation error:', err)
                      setVariationsError('Network error. Please check your connection and try again.')
                    } finally {
                      setIsGeneratingVariations(false)
                    }
                  }}
                  disabled={isGeneratingVariations || !variationsContent.trim() || variationTypes.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingVariations ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Shuffle className="mr-2 h-4 w-4" />
                      Generate Variations
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Variations</CardTitle>
                <CardDescription>
                  Your AI-generated content variations will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingVariations ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Generating variations...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                ) : generatedVariations ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{generatedVariations}</pre>
                    </div>
                    
                    <Button
                      onClick={async () => {
                        if (generatedVariations) {
                          try {
                            await navigator.clipboard.writeText(generatedVariations)
                            setVariationsCopied(true)
                            setTimeout(() => setVariationsCopied(false), 2000)
                          } catch (err) {
                            console.error('Failed to copy:', err)
                          }
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {variationsCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Variations
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Shuffle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Enter content and click "Generate Variations" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brand-voice" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-emerald-600" />
                AI Brand Voice Learner
              </CardTitle>
              <CardDescription>Train AI to match your brand's unique voice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Brand voice learning will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}