'use client'

const API_BASE_URL = 'https://socialpilot-evimero-backend.onrender.com/api/v1'

// Get auth headers helper
const getAuthHeaders = (): HeadersInit => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  return headers
}

// Types
export interface Organization {
  id: string
  name: string
  slug?: string
  description?: string
  logo?: string
  website?: string
  industry?: string
  size?: string
  timezone?: string
  language?: string
  brand_voice?: string
  brand_guidelines?: string
  primary_color?: string
  secondary_color?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
  owner_id?: string
  owner?: {
    id: string
    name?: string
    email: string
  }
  members_count?: number
  plan?: string
  sso_enabled?: boolean
}

export interface OrganizationMember {
  id: string
  user_id?: string
  user?: {
    id: string
    name?: string
    first_name?: string
    last_name?: string
    email: string
    image?: string
  }
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joined_at?: string
  invited_by?: string
  status?: 'active' | 'pending' | 'suspended'
}

export interface CreateOrganizationData {
  name: string
  description?: string
  website?: string
  industry?: string
  size?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+"
  timezone?: string
  language?: string
}

export interface UpdateOrganizationData {
  name?: string
  description?: string
  website?: string
  industry?: string
  size?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+"
  logo?: string
  timezone?: string
  language?: string
  brand_voice?: string
  brand_guidelines?: string
  primary_color?: string
  secondary_color?: string
}

export interface InviteMemberData {
  email: string
  role: string // e.g., "Social Media Responder", "Content Manager", "admin", "member", "viewer"
  organization_id?: string // Optional, can be passed separately
  message?: string
}

export interface SSOConfigData {
  type: 'SAML2.0' | 'OIDC'
  idp_metadata_url?: string
  idp_metadata?: {
    entityID: string
    singleSignOnService: {
      url: string
      binding: string
    }
    x509cert: string
  }
  sso_domains: string[]
}

export interface SSOManualMetadata {
  entityID: string
  singleSignOnService: {
    url: string
    binding: string
  }
  x509cert: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Organization CRUD Operations

export async function getOrganizations(): Promise<ApiResponse<Organization[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch organizations',
      }
    }

    const organizations = result?.data || result?.organizations || result || []
    return {
      success: true,
      data: Array.isArray(organizations) ? organizations : [],
    }
  } catch (err) {
    console.error('Failed to fetch organizations:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function getOrganization(orgId: string): Promise<ApiResponse<Organization>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch organization',
      }
    }

    return {
      success: true,
      data: result?.data || result,
    }
  } catch (err) {
    console.error('Failed to fetch organization:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function createOrganization(data: CreateOrganizationData): Promise<ApiResponse<Organization>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to create organization',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Organization created successfully',
    }
  } catch (err) {
    console.error('Failed to create organization:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function updateOrganization(orgId: string, data: UpdateOrganizationData): Promise<ApiResponse<Organization>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to update organization',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Organization updated successfully',
    }
  } catch (err) {
    console.error('Failed to update organization:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function deleteOrganization(orgId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to delete organization',
      }
    }

    return {
      success: true,
      message: result?.message || 'Organization deleted successfully',
    }
  } catch (err) {
    console.error('Failed to delete organization:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Organization Members

export async function getOrganizationMembers(orgId: string): Promise<ApiResponse<OrganizationMember[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch members',
      }
    }

    const members = result?.data || result?.members || result || []
    return {
      success: true,
      data: Array.isArray(members) ? members : [],
    }
  } catch (err) {
    console.error('Failed to fetch members:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function inviteMember(orgId: string, data: InviteMemberData): Promise<ApiResponse<OrganizationMember>> {
  try {
    // Use the /teams/invite endpoint with organization_id in the payload
    const payload = {
      email: data.email,
      role: data.role,
      organization_id: orgId,
    }

    const response = await fetch(`${API_BASE_URL}/teams/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to invite member',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Invitation sent successfully',
    }
  } catch (err) {
    console.error('Failed to invite member:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function updateMemberRole(orgId: string, memberId: string, role: string): Promise<ApiResponse<OrganizationMember>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${memberId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to update member role',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Member role updated successfully',
    }
  } catch (err) {
    console.error('Failed to update member role:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function removeMember(orgId: string, memberId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${memberId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to remove member',
      }
    }

    return {
      success: true,
      message: result?.message || 'Member removed successfully',
    }
  } catch (err) {
    console.error('Failed to remove member:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// SSO Configuration

export async function getSSOConfig(orgId: string): Promise<ApiResponse<SSOConfigData & { enabled: boolean }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/sso`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch SSO configuration',
      }
    }

    return {
      success: true,
      data: result?.data || result,
    }
  } catch (err) {
    console.error('Failed to fetch SSO config:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function configureSSOConfig(orgId: string, data: SSOConfigData): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/sso/configure`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to configure SSO',
      }
    }

    return {
      success: true,
      message: result?.message || 'SSO configured successfully',
    }
  } catch (err) {
    console.error('Failed to configure SSO:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function disableSSO(orgId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/sso`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to disable SSO',
      }
    }

    return {
      success: true,
      message: result?.message || 'SSO disabled successfully',
    }
  } catch (err) {
    console.error('Failed to disable SSO:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export interface SSOValidationResult {
  valid: boolean
  enabled?: boolean
  message?: string
  details?: {
    entityID?: string
    ssoUrl?: string
    certificate_valid?: boolean
    domains_configured?: string[]
  }
  errors?: string[]
}

export interface SSOSettingsData {
  enforce_sso: boolean
  sso_domains: string[]
}

export async function updateSSOSettings(orgId: string, data: SSOSettingsData): Promise<ApiResponse<SSOSettingsData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/sso/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to update SSO settings',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'SSO settings updated successfully',
    }
  } catch (err) {
    console.error('Failed to update SSO settings:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function getSSOSettings(orgId: string): Promise<ApiResponse<SSOSettingsData & { enabled: boolean }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/sso/settings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch SSO settings',
      }
    }

    return {
      success: true,
      data: result?.data || result,
    }
  } catch (err) {
    console.error('Failed to fetch SSO settings:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export interface SSOAuditLog {
  id: string
  action: string
  user_id?: string
  user_email?: string
  user_name?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  timestamp?: string
}

export interface SSOAuditLogsResponse {
  logs: SSOAuditLog[]
  total: number
  limit: number
  skip: number
}

export async function getSSOAuditLogs(
  orgId: string, 
  params: { limit?: number; skip?: number } = {}
): Promise<ApiResponse<SSOAuditLogsResponse>> {
  try {
    const queryParams = new URLSearchParams()
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString())
    
    const url = `${API_BASE_URL}/organizations/${orgId}/sso/audit-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch SSO audit logs',
      }
    }

    // Handle various response formats
    const logs = result?.data?.logs || result?.logs || result?.data || []
    const total = result?.data?.total || result?.total || logs.length
    
    return {
      success: true,
      data: {
        logs: Array.isArray(logs) ? logs : [],
        total,
        limit: params.limit || 50,
        skip: params.skip || 0,
      },
    }
  } catch (err) {
    console.error('Failed to fetch SSO audit logs:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

export async function validateSSOConfig(orgId: string): Promise<ApiResponse<SSOValidationResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/sso/validate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to validate SSO configuration',
        data: {
          valid: false,
          errors: result?.errors || [result?.message || 'Validation failed'],
        },
      }
    }

    return {
      success: true,
      data: result?.data || result || { valid: true, enabled: true },
      message: result?.message || 'SSO configuration validated and enabled successfully',
    }
  } catch (err) {
    console.error('Failed to validate SSO:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
      data: {
        valid: false,
        errors: ['Network error occurred during validation'],
      },
    }
  }
}

// Switch organization context
export async function switchOrganization(orgId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/switch`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to switch organization',
      }
    }

    // Store current org ID locally
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_org_id', orgId)
    }

    return {
      success: true,
      message: result?.message || 'Switched organization successfully',
    }
  } catch (err) {
    console.error('Failed to switch organization:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Get current organization ID
export function getCurrentOrgId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('current_org_id')
}

