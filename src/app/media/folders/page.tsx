'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Folder, FolderPlus, Loader2, Image as ImageIcon, ChevronRight, ChevronDown, X, Eye, Grid, List, Edit, Trash2 } from 'lucide-react'
import { getFolders, getSubfolders, getAssets, viewFolderAssets, createFolder, updateFolder, deleteFolder, type MediaFolder, type MediaAsset } from '@/lib/api/media'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export default function MediaFoldersPage() {
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [folderAssets, setFolderAssets] = useState<Record<string, MediaAsset[]>>({})
  const [loadingAssets, setLoadingAssets] = useState<Record<string, boolean>>({})
  const [subfolders, setSubfolders] = useState<Record<string, MediaFolder[]>>({})
  const [loadingSubfolders, setLoadingSubfolders] = useState<Record<string, boolean>>({})
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [viewingFolder, setViewingFolder] = useState<MediaFolder | null>(null)
  const [viewAssets, setViewAssets] = useState<MediaAsset[]>([])
  const [isLoadingViewAssets, setIsLoadingViewAssets] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [selectedParentFolder, setSelectedParentFolder] = useState<string | null>(null)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState<string | null>(null)
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null)
  const [editFolderName, setEditFolderName] = useState('')
  const [isUpdatingFolder, setIsUpdatingFolder] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    setIsLoading(true)
    const response = await getFolders()
    if (response.success && response.data) {
      setFolders(response.data)
      // Fetch assets for each folder
      response.data.forEach(folder => {
        fetchFolderAssets(folder.id)
      })
    }
    setIsLoading(false)
  }

  const fetchFolderAssets = async (folderId: string) => {
    setLoadingAssets(prev => ({ ...prev, [folderId]: true }))
    const response = await getAssets({ folder_id: folderId })
    if (response.success && response.data) {
      setFolderAssets(prev => ({
        ...prev,
        [folderId]: response.data || []
      }))
    }
    setLoadingAssets(prev => ({ ...prev, [folderId]: false }))
  }

  const fetchSubfolders = async (folderId: string) => {
    setLoadingSubfolders(prev => ({ ...prev, [folderId]: true }))
    const response = await getSubfolders(folderId)
    if (response.success && response.data) {
      setSubfolders(prev => ({
        ...prev,
        [folderId]: response.data || []
      }))
      // Also fetch assets for subfolders
      response.data?.forEach(subfolder => {
        fetchFolderAssets(subfolder.id)
      })
    }
    setLoadingSubfolders(prev => ({ ...prev, [folderId]: false }))
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
      // Fetch subfolders if not already loaded
      if (!subfolders[folderId] && !loadingSubfolders[folderId]) {
        fetchSubfolders(folderId)
      }
    }
    setExpandedFolders(newExpanded)
  }

  const handleViewFolder = async (folder: MediaFolder) => {
    setViewingFolder(folder)
    setIsLoadingViewAssets(true)
    setViewAssets([])
    
    const response = await viewFolderAssets(folder.id)
    if (response.success && response.data) {
      setViewAssets(response.data)
    }
    setIsLoadingViewAssets(false)
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setCreateError('Folder name is required')
      return
    }

    setIsCreatingFolder(true)
    setCreateError(null)
    setCreateSuccess(null)

    try {
      const response = await createFolder({
        name: newFolderName.trim(),
        parent_folder_id: selectedParentFolder || null,
      })

      if (response.success) {
        setCreateSuccess('Folder created successfully!')
        setNewFolderName('')
        setSelectedParentFolder(null)
        setShowCreateFolder(false)
        // Refresh folders list
        await fetchFolders()
        // If created as subfolder, expand parent
        if (selectedParentFolder) {
          setExpandedFolders(prev => new Set(prev).add(selectedParentFolder))
          // Fetch subfolders for the parent
          await fetchSubfolders(selectedParentFolder)
        }
        setTimeout(() => setCreateSuccess(null), 3000)
      } else {
        setCreateError(response.error || 'Failed to create folder')
      }
    } catch (error) {
      console.error('Create folder error:', error)
      setCreateError('An error occurred while creating the folder')
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleCreateSubfolder = (parentFolderId: string) => {
    setSelectedParentFolder(parentFolderId)
    setShowCreateFolder(true)
    // Expand parent folder if not already expanded
    if (!expandedFolders.has(parentFolderId)) {
      setExpandedFolders(prev => new Set(prev).add(parentFolderId))
      fetchSubfolders(parentFolderId)
    }
  }

  const handleEditFolder = (folder: MediaFolder) => {
    setEditingFolder(folder)
    setEditFolderName(folder.name)
    setUpdateError(null)
    setUpdateSuccess(null)
  }

  const handleUpdateFolder = async () => {
    if (!editingFolder || !editFolderName.trim()) {
      setUpdateError('Folder name is required')
      return
    }

    setIsUpdatingFolder(true)
    setUpdateError(null)
    setUpdateSuccess(null)

    try {
      const response = await updateFolder(editingFolder.id, {
        name: editFolderName.trim(),
      })

      if (response.success) {
        setUpdateSuccess('Folder updated successfully!')
        setEditingFolder(null)
        setEditFolderName('')
        // Refresh folders list
        await fetchFolders()
        setTimeout(() => setUpdateSuccess(null), 3000)
      } else {
        setUpdateError(response.error || 'Failed to update folder')
      }
    } catch (error) {
      console.error('Update folder error:', error)
      setUpdateError('An error occurred while updating the folder')
    } finally {
      setIsUpdatingFolder(false)
    }
  }

  const handleDeleteFolder = async (folder: MediaFolder) => {
    if (!confirm(`Are you sure you want to delete "${folder.name}"? This action cannot be undone and will also delete all subfolders and assets inside.`)) {
      return
    }

    setDeletingFolderId(folder.id)
    setDeleteError(null)
    setDeleteSuccess(null)

    try {
      const response = await deleteFolder(folder.id)
      if (response.success) {
        setDeleteSuccess(`Folder "${folder.name}" deleted successfully`)
        // Refresh folders list
        await fetchFolders()
        // Clear subfolders cache for this folder's parent if it was a subfolder
        if (folder.parent_id) {
          const parentSubfolders = subfolders[folder.parent_id] || []
          setSubfolders(prev => ({
            ...prev,
            [folder.parent_id!]: parentSubfolders.filter(sf => sf.id !== folder.id)
          }))
        }
        setTimeout(() => setDeleteSuccess(null), 3000)
      } else {
        setDeleteError(response.error || 'Failed to delete folder')
        setTimeout(() => setDeleteError(null), 5000)
      }
    } catch (error) {
      console.error('Delete folder error:', error)
      setDeleteError('An error occurred while deleting the folder')
      setTimeout(() => setDeleteError(null), 5000)
    } finally {
      setDeletingFolderId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Folders</h1>
          <p className="text-gray-500 mt-1">Organize and manage your media folders</p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            setShowCreateFolder(true)
            setSelectedParentFolder(null)
            setNewFolderName('')
            setCreateError(null)
          }}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          Create Folder
        </Button>
      </div>

      {/* Success/Error Messages */}
      {createSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center justify-between">
          <span>{createSuccess}</span>
          <button
            onClick={() => setCreateSuccess(null)}
            className="ml-2 text-emerald-500 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {createError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{createError}</span>
          <button
            onClick={() => setCreateError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {updateSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center justify-between">
          <span>{updateSuccess}</span>
          <button
            onClick={() => setUpdateSuccess(null)}
            className="ml-2 text-emerald-500 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {updateError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{updateError}</span>
          <button
            onClick={() => setUpdateError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading folders...</span>
        </div>
      ) : folders.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders yet</h3>
              <p className="text-gray-600 mb-4">Create folders to organize your media assets</p>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setShowCreateFolder(true)
                  setSelectedParentFolder(null)
                  setNewFolderName('')
                  setCreateError(null)
                }}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Your First Folder
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Folders Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Root/All Media Folder */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Folder className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">All Media</CardTitle>
                    <CardDescription>Root folder</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span>All assets</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/media'}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Folder Cards */}
          {folders
            .filter(folder => !folder.parent_id) // Only show root-level folders
            .map((folder) => {
              const assets = folderAssets[folder.id] || []
              const isLoading = loadingAssets[folder.id] || false
              const folderSubfolders = subfolders[folder.id] || []
              const isExpanded = expandedFolders.has(folder.id)
              const isLoadingSubs = loadingSubfolders[folder.id] || false
              
              return (
                <div key={folder.id} className="space-y-2">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => toggleFolder(folder.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoadingSubs}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Folder className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{folder.name}</CardTitle>
                            <CardDescription>
                              {folder.created_at 
                                ? new Date(folder.created_at).toLocaleDateString()
                                : 'Folder'}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        {isLoading ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-gray-600">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            <span>
                              {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
                              {folder.asset_count !== undefined && folder.asset_count !== assets.length && (
                                <span className="text-gray-400"> ({folder.asset_count} total)</span>
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateSubfolder(folder.id)}
                            title="Create subfolder"
                          >
                            <FolderPlus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFolder(folder)}
                            title="Edit folder"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFolder(folder)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFolder(folder)}
                            disabled={deletingFolderId === folder.id}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            title="Delete folder"
                          >
                            {deletingFolderId === folder.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subfolders */}
                  {isExpanded && (
                    <div className="ml-8 space-y-2">
                      {isLoadingSubs ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                          <span className="text-sm text-gray-500">Loading subfolders...</span>
                        </div>
                      ) : folderSubfolders.length > 0 ? (
                        folderSubfolders.map((subfolder) => {
                          const subAssets = folderAssets[subfolder.id] || []
                          const subIsLoading = loadingAssets[subfolder.id] || false
                          
                          return (
                            <Card key={subfolder.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-300">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Folder className="h-5 w-5 text-blue-500" />
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-base">{subfolder.name}</CardTitle>
                                    <CardDescription className="text-xs">
                                      {subfolder.created_at 
                                        ? new Date(subfolder.created_at).toLocaleDateString()
                                        : 'Subfolder'}
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                  {subIsLoading ? (
                                    <div className="flex items-center text-xs text-gray-600">
                                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                      <span>Loading...</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-xs text-gray-600">
                                      <ImageIcon className="h-3 w-3 mr-2" />
                                      <span>
                                        {subAssets.length} {subAssets.length === 1 ? 'asset' : 'assets'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCreateSubfolder(subfolder.id)}
                                      className="h-7 text-xs"
                                      title="Create subfolder"
                                    >
                                      <FolderPlus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditFolder(subfolder)}
                                      className="h-7 text-xs"
                                      title="Edit folder"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewFolder(subfolder)}
                                      className="h-7 text-xs"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteFolder(subfolder)}
                                      disabled={deletingFolderId === subfolder.id}
                                      className="h-7 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                                      title="Delete folder"
                                    >
                                      {deletingFolderId === subfolder.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-400">
                          No subfolders
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      )}

      {/* View Folder Assets Modal */}
      <Sheet open={!!viewingFolder} onOpenChange={(open) => !open && setViewingFolder(null)}>
        <SheetContent className="w-full sm:w-[800px] p-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {viewingFolder?.name || 'Folder Assets'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {viewAssets.length} {viewAssets.length === 1 ? 'asset' : 'assets'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none h-8"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none h-8"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <button
                    onClick={() => setViewingFolder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoadingViewAssets ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading assets...</span>
                </div>
              ) : viewAssets.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No assets in this folder</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {viewAssets.map((asset) => {
                    const fileType = getFileType(asset)
                    const fileName = asset.name || asset.file_name || 'Untitled'
                    const fileSize = formatFileSize(asset.size)
                    
                    return (
                      <div
                        key={asset.id}
                        className="group relative bg-white border border-gray-200 rounded-lg p-3 hover:border-emerald-300 hover:shadow-md transition-all"
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                          {fileType === 'image' && asset.url ? (
                            <img
                              src={asset.url}
                              alt={fileName}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
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
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {viewAssets.map((asset) => {
                    const fileType = getFileType(asset)
                    const fileName = asset.name || asset.file_name || 'Untitled'
                    const fileSize = formatFileSize(asset.size)
                    const createdAt = asset.created_at || asset.createdAt || ''
                    
                    return (
                      <div
                        key={asset.id}
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
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create Folder Modal */}
      <Sheet open={showCreateFolder} onOpenChange={(open) => !open && setShowCreateFolder(false)}>
        <SheetContent className="w-full sm:w-[500px] p-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedParentFolder ? 'Create Subfolder' : 'Create Folder'}
                </h2>
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Folder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder()
                    }
                  }}
                  placeholder="Enter folder name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {/* Parent Folder Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Folder
                </label>
                <select
                  value={selectedParentFolder || ''}
                  onChange={(e) => setSelectedParentFolder(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Root (No parent)</option>
                  {folders
                    .filter(f => !f.parent_id)
                    .map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedParentFolder 
                    ? 'This will be created as a subfolder'
                    : 'Leave empty to create a root folder'}
                </p>
              </div>

              {/* Error Message */}
              {createError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {createError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateFolder(false)
                  setNewFolderName('')
                  setSelectedParentFolder(null)
                  setCreateError(null)
                }}
                disabled={isCreatingFolder}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={isCreatingFolder || !newFolderName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isCreatingFolder ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create Folder
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Folder Modal */}
      <Sheet open={!!editingFolder} onOpenChange={(open) => !open && setEditingFolder(null)}>
        <SheetContent className="w-full sm:w-[500px] p-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Folder</h2>
                <button
                  onClick={() => setEditingFolder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {editingFolder && (
                <>
                  {/* Folder Preview */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Folder className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Current: {editingFolder.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {editingFolder.created_at 
                          ? `Created ${new Date(editingFolder.created_at).toLocaleDateString()}`
                          : 'Folder'}
                      </p>
                    </div>
                  </div>

                  {/* Folder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Folder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateFolder()
                        }
                      }}
                      placeholder="Enter folder name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      autoFocus
                    />
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
                onClick={() => {
                  setEditingFolder(null)
                  setEditFolderName('')
                  setUpdateError(null)
                }}
                disabled={isUpdatingFolder}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateFolder}
                disabled={isUpdatingFolder || !editFolderName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isUpdatingFolder ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Folder
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}