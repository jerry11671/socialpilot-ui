'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Folder, Tag, Image as ImageIcon, Palette, Grid, List } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function MediaPage() {
  const [showFolderManager, setShowFolderManager] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'library' | 'canva' | 'brand-kits'>('library')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const mockMediaItems = [
    { id: '1', name: 'product-launch.jpg', type: 'image', size: '2.4 MB', url: '/placeholder-image.jpg', createdAt: '2024-01-15' },
    { id: '2', name: 'team-photo.png', type: 'image', size: '1.8 MB', url: '/placeholder-image.jpg', createdAt: '2024-01-14' },
    { id: '3', name: 'promo-video.mp4', type: 'video', size: '15.2 MB', url: '/placeholder-video.mp4', createdAt: '2024-01-13' },
    { id: '4', name: 'logo-variations.svg', type: 'image', size: '0.5 MB', url: '/placeholder-image.jpg', createdAt: '2024-01-12' },
    { id: '5', name: 'infographic.pdf', type: 'document', size: '3.1 MB', url: '/placeholder-doc.pdf', createdAt: '2024-01-11' },
    { id: '6', name: 'social-banner.jpg', type: 'image', size: '1.2 MB', url: '/placeholder-image.jpg', createdAt: '2024-01-10' }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-emerald-600" />
      case 'video':
        return <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">MP4</div>
      case 'document':
        return <div className="h-8 w-8 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">PDF</div>
      default:
        return <ImageIcon className="h-8 w-8 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage your digital assets and Canva designs</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">
            <ImageIcon className="mr-2 h-4 w-4" />
            Media Library
          </TabsTrigger>
          <TabsTrigger value="canva">
            <Palette className="mr-2 h-4 w-4" />
            Canva
          </TabsTrigger>
          <TabsTrigger value="brand-kits">
            <Palette className="mr-2 h-4 w-4" />
            Brand Kits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New Media</CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drop files here to upload</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse from your computer</p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Supports: JPG, PNG, GIF, MP4, PDF (Max 50MB per file)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media Library */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Media</CardTitle>
                  <CardDescription>Browse and manage your media files</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFolderManager(true)}
                    className={selectedFolderId ? 'border-emerald-300 bg-emerald-50' : ''}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    Folders
                    {selectedFolderId && <span className="ml-1 text-xs">(1)</span>}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTagManager(true)}
                    className={selectedTagIds.length > 0 ? 'border-emerald-300 bg-emerald-50' : ''}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Tags
                    {selectedTagIds.length > 0 && <span className="ml-1 text-xs">({selectedTagIds.length})</span>}
                  </Button>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {mockMediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-white border border-gray-200 rounded-lg p-3 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        {item.type === 'image' ? (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-emerald-600" />
                          </div>
                        ) : (
                          getFileIcon(item.type)
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">{item.size}</p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <span className="sr-only">More options</span>
                          •••
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {mockMediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type} • {item.size} • {item.createdAt}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canva" className="space-y-6">
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="designs">My Designs</TabsTrigger>
            </TabsList>
            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Canva Templates</CardTitle>
                  <CardDescription>Browse and use professional templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-400">
                    <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Canva templates will be displayed here</p>
                    <p className="text-xs mt-1">Connect your Canva account to get started</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="designs">
              <Card>
                <CardHeader>
                  <CardTitle>My Canva Designs</CardTitle>
                  <CardDescription>Import and manage your Canva creations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-400">
                    <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your Canva designs will be displayed here</p>
                    <p className="text-xs mt-1">Create designs in Canva and import them here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="brand-kits">
          <Card>
            <CardHeader>
              <CardTitle>Brand Kits</CardTitle>
              <CardDescription>Manage your brand colors, fonts, and logos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Brand kit management will be displayed here</p>
                <p className="text-xs mt-1">Set up your brand guidelines and assets</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}