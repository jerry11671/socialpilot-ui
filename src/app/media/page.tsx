'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Folder, Tag, Image as ImageIcon, Palette, Grid, List, X, Loader2, Filter, Edit, Plus, Move } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { uploadAsset, getAssets, deleteAsset, updateAsset, moveAssetToFolder, getFolders, type MediaAsset, type MediaFolder } from '@/lib/api/media'

// Component for image with fallback
function ImageWithFallback({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <>{fallback}</>
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-lg"
      onError={() => setHasError(true)}
    />
  )
}

export default function MediaPage() {
  const [showFolderManager, setShowFolderManager] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedSource, setSelectedSource] = useState<'upload' | 'generated' | 'canva' | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'library' | 'canva' | 'brand-kits'>('library')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null)
  const [editDescription, setEditDescription] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [editFolderId, setEditFolderId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)
  const [movingAssetId, setMovingAssetId] = useState<string | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)
  const [moveSuccess, setMoveSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAreaRef = useRef<HTMLDivElement>(null)

  // Update source filter when tab changes
  useEffect(() => {
    if (activeTab === 'canva') {
      setSelectedSource('canva')
    } else if (activeTab === 'library') {
      setSelectedSource(undefined) // Show all in library tab
    } else {
      setSelectedSource(undefined)
    }
  }, [activeTab])

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders()
  }, [])

  // Fetch assets on mount and when filters change
  useEffect(() => {
    fetchAssets()
  }, [selectedFolderId, selectedTagIds, selectedSource])

  const fetchFolders = async () => {
    setIsLoadingFolders(true)
    const response = await getFolders()
    if (response.success && response.data) {
      setFolders(response.data)
    }
    setIsLoadingFolders(false)
  }

  const fetchAssets = async () => {
    setIsLoading(true)
    const response = await getAssets({
      folder_id: selectedFolderId || undefined,
      tags: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      source: selectedSource,
    })
    
    if (response.success && response.data) {
      setMediaItems(response.data)
    }
    setIsLoading(false)
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const file = files[0]
      
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024 // 50MB in bytes
      if (file.size > maxSize) {
        setUploadError('File size exceeds 50MB limit')
        setIsUploading(false)
        return
      }

      // Determine file type
      const fileType = file.type.startsWith('image/') ? 'image' :
                      file.type.startsWith('video/') ? 'video' :
                      file.type === 'application/pdf' ? 'document' :
                      file.type === 'image/gif' ? 'gif' : 'image'

      const response = await uploadAsset({
        file,
        folder_id: selectedFolderId || undefined,
        tags: selectedTagIds.length > 0 ? selectedTagIds : ['branded'],
        description: 'Branded',
        source: 'upload',
      })

      if (response.success) {
        setUploadSuccess('File uploaded successfully!')
        // Refresh the media list
        await fetchAssets()
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(null), 3000)
      } else {
        setUploadError(response.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('An error occurred while uploading the file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileType = (asset: MediaAsset): string => {
    if (asset.type) return asset.type
    const url = asset.url || asset.file_name || ''
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'image'
    if (url.match(/\.(mp4|mov|avi|webm)$/i)) return 'video'
    if (url.match(/\.(pdf|doc|docx)$/i)) return 'document'
    return 'image'
  }

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

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) return

    setDeletingAssetId(assetId)
    setDeleteError(null)
    setDeleteSuccess(null)

    try {
      const response = await deleteAsset(assetId)
      if (response.success) {
        setDeleteSuccess('Asset deleted successfully')
        await fetchAssets()
        // Clear success message after 3 seconds
        setTimeout(() => setDeleteSuccess(null), 3000)
      } else {
        setDeleteError(response.error || 'Failed to delete asset')
        // Clear error message after 5 seconds
        setTimeout(() => setDeleteError(null), 5000)
      }
    } catch (error) {
      console.error('Delete error:', error)
      setDeleteError('An error occurred while deleting the asset')
      setTimeout(() => setDeleteError(null), 5000)
    } finally {
      setDeletingAssetId(null)
    }
  }

  const handleEditAsset = (asset: MediaAsset) => {
    setEditingAsset(asset)
    setEditDescription(asset.description || '')
    setEditTags(asset.tags || [])
    setEditFolderId(asset.folder_id || null)
    setNewTag('')
    setUpdateError(null)
    // Refresh folders when opening edit modal
    fetchFolders()
  }

  const handleMoveAsset = async (assetId: string, folderId: string | null) => {
    setMovingAssetId(assetId)
    setMoveError(null)
    setMoveSuccess(null)

    try {
      const response = await moveAssetToFolder(assetId, folderId)
      if (response.success) {
        const folderName = folderId 
          ? folders.find(f => f.id === folderId)?.name || 'folder'
          : 'root'
        setMoveSuccess(`Asset moved to ${folderName === 'root' ? 'root' : folderName} successfully`)
        await fetchAssets()
        setTimeout(() => setMoveSuccess(null), 3000)
      } else {
        setMoveError(response.error || 'Failed to move asset')
        setTimeout(() => setMoveError(null), 5000)
      }
    } catch (error) {
      console.error('Move error:', error)
      setMoveError('An error occurred while moving the asset')
      setTimeout(() => setMoveError(null), 5000)
    } finally {
      setMovingAssetId(null)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove))
  }

  const handleUpdateAsset = async () => {
    if (!editingAsset) return

    setIsUpdating(true)
    setUpdateError(null)

    try {
      // First update the asset metadata
      const updateResponse = await updateAsset(editingAsset.id, {
        tags: editTags,
        description: editDescription,
        folder_id: editFolderId,
      })

      // If folder changed, move the asset
      if (editFolderId !== editingAsset.folder_id) {
        const moveResponse = await moveAssetToFolder(
          editingAsset.id,
          editFolderId
        )
        
        if (!moveResponse.success) {
          setUpdateError(moveResponse.error || 'Failed to move asset to folder')
          setIsUpdating(false)
          return
        }
      }

      if (updateResponse.success) {
        setEditingAsset(null)
        await fetchAssets()
      } else {
        setUpdateError(updateResponse.error || 'Failed to update asset')
      }
    } catch (error) {
      console.error('Update error:', error)
      setUpdateError('An error occurred while updating the asset')
    } finally {
      setIsUpdating(false)
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

      {/* Success/Error Messages */}
      {deleteSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center justify-between">
          <span>{deleteSuccess}</span>
          <button
            onClick={() => setDeleteSuccess(null)}
            className="ml-2 text-emerald-500 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {deleteError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {moveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center justify-between">
          <span>{moveSuccess}</span>
          <button
            onClick={() => setMoveSuccess(null)}
            className="ml-2 text-emerald-500 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {moveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{moveError}</span>
          <button
            onClick={() => setMoveError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
              <div
                ref={uploadAreaRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-400'
                } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <>
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Uploading...</p>
                    <p className="text-sm text-gray-500">Please wait while your file is being uploaded</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Drop files here to upload</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse from your computer</p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                      Supports: JPG, PNG, GIF, MP4, PDF (Max 50MB per file)
                    </p>
                  </>
                )}

                {uploadError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
                    <span>{uploadError}</span>
                    <button
                      onClick={() => setUploadError(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center justify-between">
                    <span>{uploadSuccess}</span>
                    <button
                      onClick={() => setUploadSuccess(null)}
                      className="ml-2 text-emerald-500 hover:text-emerald-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media Library */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedSource === 'upload' ? 'Uploaded Media' :
                     selectedSource === 'generated' ? 'Generated Media' :
                     selectedSource === 'canva' ? 'Canva Designs' :
                     'All Media'}
                  </CardTitle>
                  <CardDescription>
                    {selectedSource 
                      ? `Showing ${selectedSource} assets` 
                      : 'Browse and manage your media files'}
                  </CardDescription>
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
                  <div className="relative">
                    <select
                      value={selectedSource || 'all'}
                      onChange={(e) => {
                        const value = e.target.value
                        setSelectedSource(value === 'all' ? undefined : value as 'upload' | 'generated' | 'canva')
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:bg-gray-50"
                    >
                      <option value="all">All Sources</option>
                      <option value="upload">Upload</option>
                      <option value="generated">Generated</option>
                      <option value="canva">Canva</option>
                    </select>
                    <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
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
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading media...</span>
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No media files found</p>
                  <p className="text-xs mt-1">Upload your first file to get started</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {mediaItems.map((item) => {
                    const fileType = getFileType(item)
                    const fileName = item.name || item.file_name || 'Untitled'
                    const fileSize = formatFileSize(item.size)
                    return (
                      <div
                        key={item.id}
                        className="group relative bg-white border border-gray-200 rounded-lg p-3 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                          {fileType === 'image' && item.url ? (
                            <ImageWithFallback
                              src={item.url}
                              alt={fileName}
                              fallback={<div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                                {getFileIcon(fileType)}
                              </div>}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                              {getFileIcon(fileType)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
                            {fileName}
                          </p>
                          <p className="text-xs text-gray-500">{fileSize}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditAsset(item)
                            }}
                            title="Edit"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAsset(item.id)
                            }}
                            title="Delete"
                            disabled={deletingAssetId === item.id}
                          >
                            {deletingAssetId === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaItems.map((item) => {
                    const fileType = getFileType(item)
                    const fileName = item.name || item.file_name || 'Untitled'
                    const fileSize = formatFileSize(item.size)
                    const createdAt = item.created_at || item.createdAt || ''
                    return (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                          <p className="text-xs text-gray-500">
                            {fileType} • {fileSize} {createdAt && `• ${new Date(createdAt).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAsset(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAsset(item.id)}
                            disabled={deletingAssetId === item.id}
                          >
                            {deletingAssetId === item.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
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

      {/* Edit Asset Modal */}
      <Sheet open={!!editingAsset} onOpenChange={(open) => !open && setEditingAsset(null)}>
        <SheetContent className="w-full sm:w-[500px] p-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Asset</h2>
                <button
                  onClick={() => setEditingAsset(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {editingAsset && (
                <>
                  {/* Asset Preview */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {getFileType(editingAsset) === 'image' && editingAsset.url ? (
                      <img
                        src={editingAsset.url}
                        alt={editingAsset.name || editingAsset.file_name || 'Asset'}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        {getFileIcon(getFileType(editingAsset))}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {editingAsset.name || editingAsset.file_name || 'Untitled'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(editingAsset.size)}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Enter asset description..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    
                    {/* Existing Tags */}
                    {editTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-emerald-600 hover:text-emerald-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add New Tag */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <Button
                        onClick={handleAddTag}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Folder Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Folder
                    </label>
                    <select
                      value={editFolderId || ''}
                      onChange={(e) => setEditFolderId(e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">No Folder (Root)</option>
                      {isLoadingFolders ? (
                        <option disabled>Loading folders...</option>
                      ) : (
                        folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select a folder to organize this asset
                    </p>
                  </div>

                  {/* Error Message */}
                  {updateError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {updateError}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditingAsset(null)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAsset}
                disabled={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}