'use client'

const API_BASE_URL = 'https://socialpilot-evimero-backend.onrender.com/api/v1'

// Get auth headers helper
const getAuthHeaders = (includeContentType: boolean = true): HeadersInit => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const headers: HeadersInit = {}
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  return headers
}

// Types
export interface MediaAsset {
  id: string
  name?: string
  file_name?: string
  url: string
  type?: 'image' | 'video' | 'document' | 'gif'
  size?: number
  size_formatted?: string
  folder_id?: string | null
  tags?: string[]
  description?: string
  source?: 'upload' | 'generated' | 'canva'
  created_at?: string
  createdAt?: string
  updated_at?: string
  created_by?: string
  [key: string]: any
}

export interface MediaFolder {
  id: string
  name: string
  parent_id?: string | null
  created_at?: string
  createdAt?: string
  updated_at?: string
  asset_count?: number
  [key: string]: any
}

export interface MediaTag {
  id: string
  name: string
  color?: string
  created_at?: string
  createdAt?: string
  asset_count?: number
  [key: string]: any
}

export interface UploadAssetData {
  file: File
  folder_id?: string | null
  tags?: string[]
  description?: string
  source?: 'upload' | 'generated' | 'canva'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Upload a new asset
 * POST /content-library/assets
 */
export async function uploadAsset(data: UploadAssetData): Promise<ApiResponse<MediaAsset>> {
  try {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      }
    }

    const formData = new FormData()
    formData.append('file', data.file)
    
    if (data.folder_id) {
      formData.append('folder_id', data.folder_id)
    }
    
    if (data.tags && data.tags.length > 0) {
      // If tags is an array, we need to append it properly
      // Some APIs expect JSON string, others expect multiple form fields
      formData.append('tags', JSON.stringify(data.tags))
    }
    
    if (data.description) {
      formData.append('description', data.description)
    }
    
    formData.append('source', data.source || 'upload')

    const response = await fetch(`${API_BASE_URL}/content-library/assets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to upload asset',
      }
    }

    const asset = result?.data || result?.asset || result
    
    if (!asset) {
      return {
        success: false,
        error: 'Invalid asset data received',
      }
    }

    return {
      success: true,
      data: asset,
      message: result?.message || 'Asset uploaded successfully',
    }
  } catch (err) {
    console.error('Failed to upload asset:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get all assets
 * GET /content-library/assets
 */
export async function getAssets(params?: {
  folder_id?: string
  tags?: string[]
  source?: 'upload' | 'generated' | 'canva'
  limit?: number
  skip?: number
}): Promise<ApiResponse<MediaAsset[]>> {
  try {
    const queryParams = new URLSearchParams()
    
    if (params?.folder_id) {
      queryParams.append('folder_id', params.folder_id)
    }
    
    if (params?.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag))
    }
    
    if (params?.source) {
      queryParams.append('source', params.source)
    }
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }
    
    if (params?.skip !== undefined) {
      queryParams.append('skip', params.skip.toString())
    }

    const url = `${API_BASE_URL}/content-library/assets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch assets',
      }
    }

    const assets = result?.data || result?.assets || result || []
    return {
      success: true,
      data: Array.isArray(assets) ? assets : [],
    }
  } catch (err) {
    console.error('Failed to fetch assets:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get a single asset by ID
 * GET /content-library/assets/{{asset_id}}
 */
export async function getAsset(assetId: string): Promise<ApiResponse<MediaAsset>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/assets/${assetId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch asset',
      }
    }

    const asset = result?.data || result?.asset || result
    
    if (!asset) {
      return {
        success: false,
        error: 'Invalid asset data received',
      }
    }

    return {
      success: true,
      data: asset,
    }
  } catch (err) {
    console.error('Failed to fetch asset:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Delete an asset
 * DELETE /content-library/assets/{{asset_id}}
 */
export async function deleteAsset(assetId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/assets/${assetId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to delete asset',
      }
    }

    return {
      success: true,
      message: result?.message || 'Asset deleted successfully',
    }
  } catch (err) {
    console.error('Failed to delete asset:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Update an asset
 * PUT /content-library/assets/{{asset_id}}
 */
export async function updateAsset(
  assetId: string,
  data: {
    folder_id?: string | null
    tags?: string[]
    description?: string
    name?: string
  }
): Promise<ApiResponse<MediaAsset>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/assets/${assetId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to update asset',
      }
    }

    const asset = result?.data || result?.asset || result
    
    if (!asset) {
      return {
        success: false,
        error: 'Invalid asset data received',
      }
    }

    return {
      success: true,
      data: asset,
      message: result?.message || 'Asset updated successfully',
    }
  } catch (err) {
    console.error('Failed to update asset:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get all folders
 * GET /content-library/folders
 */
export async function getFolders(): Promise<ApiResponse<MediaFolder[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/folders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch folders',
      }
    }

    const folders = result?.data || result?.folders || result || []
    return {
      success: true,
      data: Array.isArray(folders) ? folders : [],
    }
  } catch (err) {
    console.error('Failed to fetch folders:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get subfolders for a specific folder
 * GET /content-library/folders/{{folder_id}}/subfolders
 */
export async function getSubfolders(folderId: string): Promise<ApiResponse<MediaFolder[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/folders/${folderId}/subfolders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch subfolders',
      }
    }

    const subfolders = result?.data || result?.subfolders || result || []
    return {
      success: true,
      data: Array.isArray(subfolders) ? subfolders : [],
    }
  } catch (err) {
    console.error('Failed to fetch subfolders:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * View assets in a folder
 * GET /content-library/folders/{{folder_id}}/view
 */
export async function viewFolderAssets(folderId: string): Promise<ApiResponse<MediaAsset[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/folders/${folderId}/view`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch folder assets',
      }
    }

    const assets = result?.data || result?.assets || result || []
    return {
      success: true,
      data: Array.isArray(assets) ? assets : [],
    }
  } catch (err) {
    console.error('Failed to fetch folder assets:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Create a new folder
 * POST /content-library/folders
 */
export async function createFolder(data: {
  name: string
  parent_folder_id?: string | null
}): Promise<ApiResponse<MediaFolder>> {
  try {
    const body: any = {
      name: data.name,
    }
    
    if (data.parent_folder_id) {
      body.parent_folder_id = data.parent_folder_id
    }

    const response = await fetch(`${API_BASE_URL}/content-library/folders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to create folder',
      }
    }

    const folder = result?.data || result?.folder || result
    
    if (!folder) {
      return {
        success: false,
        error: 'Invalid folder data received',
      }
    }

    return {
      success: true,
      data: folder,
      message: result?.message || 'Folder created successfully',
    }
  } catch (err) {
    console.error('Failed to create folder:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Update a folder
 * PUT /content-library/folders/{{folder_id}}
 */
export async function updateFolder(
  folderId: string,
  data: {
    name: string
  }
): Promise<ApiResponse<MediaFolder>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/folders/${folderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to update folder',
      }
    }

    const folder = result?.data || result?.folder || result
    
    if (!folder) {
      return {
        success: false,
        error: 'Invalid folder data received',
      }
    }

    return {
      success: true,
      data: folder,
      message: result?.message || 'Folder updated successfully',
    }
  } catch (err) {
    console.error('Failed to update folder:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Delete a folder
 * DELETE /content-library/folders/{{folder_id}}
 */
export async function deleteFolder(folderId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/folders/${folderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to delete folder',
      }
    }

    return {
      success: true,
      message: result?.message || 'Folder deleted successfully',
    }
  } catch (err) {
    console.error('Failed to delete folder:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Move an asset to a folder
 * POST /content-library/assets/{{asset_id}}/move
 */
export async function moveAssetToFolder(
  assetId: string,
  folderId: string | null
): Promise<ApiResponse<MediaAsset>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/assets/${assetId}/move`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ folder_id: folderId || null }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to move asset',
      }
    }

    const asset = result?.data || result?.asset || result
    
    if (!asset) {
      return {
        success: false,
        error: 'Invalid asset data received',
      }
    }

    return {
      success: true,
      data: asset,
      message: result?.message || 'Asset moved successfully',
    }
  } catch (err) {
    console.error('Failed to move asset:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Get all tags
 * GET /content-library/tags
 */
export async function getTags(): Promise<ApiResponse<MediaTag[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/content-library/tags`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || result?.error || 'Failed to fetch tags',
      }
    }

    const tags = result?.data || result?.tags || result || []
    return {
      success: true,
      data: Array.isArray(tags) ? tags : [],
    }
  } catch (err) {
    console.error('Failed to fetch tags:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

