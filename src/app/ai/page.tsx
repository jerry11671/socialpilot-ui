'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import { FileText, Image as ImageIcon, Hash, Video, Lightbulb, Target, Shuffle, Brain, Sparkles, Wand2 } from 'lucide-react'
import { useState } from 'react'

export default function AIPage() {
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Input states for voice input support
  const [captionInput, setCaptionInput] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')
  const [ideasInput, setIdeasInput] = useState('')

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your post about?
                  </label>
                  <div className="relative">
                    <textarea
                      value={captionInput}
                      onChange={(e) => setCaptionInput(e.target.value)}
                      placeholder="Describe your post content, product, or message... or use voice input"
                      className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setCaptionInput((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Friendly</option>
                      <option>Exciting</option>
                      <option>Informative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none">
                      <option>All Platforms</option>
                      <option>Facebook</option>
                      <option>Instagram</option>
                      <option>Twitter</option>
                      <option>LinkedIn</option>
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={() => handleGenerate('caption')}
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
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Use This Caption
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Generated caption will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5 text-emerald-600" />
                AI Image Generator
              </CardTitle>
              <CardDescription>Create stunning images with DALL-E</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">AI image generation will be available here</p>
                <p className="text-xs mt-1">Describe what you want to create</p>
              </div>
            </CardContent>
          </Card>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post content or keywords
                  </label>
                  <div className="relative">
                    <textarea
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      placeholder="Enter your post content or relevant keywords... or use voice input"
                      className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInputButton
                        onTranscript={(text) => setHashtagInput((prev) => prev ? `${prev} ${text}` : text)}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none">
                    <option>Technology</option>
                    <option>Fashion</option>
                    <option>Food & Beverage</option>
                    <option>Travel</option>
                    <option>Fitness</option>
                    <option>Business</option>
                  </select>
                </div>
                <Button 
                  onClick={() => handleGenerate('hashtags')}
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
                {generatedContent && generatedContent.includes('#') ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{generatedContent}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Copy All
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Use These Hashtags
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Generated hashtags will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="video-script" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5 text-emerald-600" />
                AI Video Script Generator
              </CardTitle>
              <CardDescription>Create engaging video scripts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Video script generation will be available here</p>
              </div>
            </CardContent>
          </Card>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-emerald-600" />
                AI CTA Suggestions
              </CardTitle>
              <CardDescription>Generate compelling call-to-action phrases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">CTA suggestions will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shuffle className="mr-2 h-5 w-5 text-emerald-600" />
                AI Content Variations
              </CardTitle>
              <CardDescription>Create multiple versions of your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Shuffle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Content variations will be available here</p>
              </div>
            </CardContent>
          </Card>
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