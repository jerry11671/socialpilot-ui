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

// Get current organization ID
const getCurrentOrgId = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('current_org_id')
}

// Types
export interface TeamMember {
  id: string
  user_id?: string
  name?: string
  first_name?: string
  last_name?: string
  email: string
  role: TeamRole
  status: 'active' | 'pending' | 'inactive' | 'suspended'
  avatar?: string
  image?: string
  joined_at?: string
  joinedAt?: string
  last_active?: string
  lastActive?: string
  invited_by?: string
  organization_id?: string
}

export type TeamRole = 
  | 'OWNER' 
  | 'ADMIN' 
  | 'CONTENT_MANAGER' 
  | 'CONTENT_CREATOR' 
  | 'SOCIAL_RESPONDER'
  | 'Social Media Responder'
  | 'ANALYST' 
  | 'VIEWER'
  | string // Allow custom roles

export interface TeamInvitation {
  id: string
  email: string
  role: TeamRole
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  invited_by?: string
  invitedBy?: string
  invited_by_name?: string
  invited_at?: string
  invitedAt?: string
  expires_at?: string
  message?: string
  organization_id?: string
}

export interface RoleDefinition {
  id: string
  name: TeamRole
  display_name: string
  description: string
  permissions: string[]
  is_custom?: boolean
  created_at?: string
}

export interface InviteMemberData {
  email: string
  role: TeamRole
  message?: string
}

export interface UpdateMemberRoleData {
  organization_id?: string
  role: TeamRole
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ============================================
// TEAM INVITATIONS
// ============================================

// Get pending invitations
export async function getPendingInvitations(organizationId?: string): Promise<ApiResponse<TeamInvitation[]>> {
  try {
    const orgId = organizationId || getCurrentOrgId()
    const queryParams = orgId ? `?organization_id=${orgId}` : ''
    
    const response = await fetch(`${API_BASE_URL}/teams/invitations${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch invitations',
      }
    }

    const invitations = result?.data || result?.invitations || result || []
    return {
      success: true,
      data: Array.isArray(invitations) ? invitations : [],
    }
  } catch (err) {
    console.error('Failed to fetch invitations:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Invite team member
export async function inviteTeamMember(data: InviteMemberData, organizationId?: string): Promise<ApiResponse<TeamInvitation>> {
  try {
    const orgId = organizationId || getCurrentOrgId()
    
    const response = await fetch(`${API_BASE_URL}/teams/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email: data.email,
        role: data.role,
        organization_id: orgId,
        message: data.message,
      }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to send invitation',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Invitation sent successfully',
    }
  } catch (err) {
    console.error('Failed to send invitation:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Legacy alias for sendInvitation
export const sendInvitation = inviteTeamMember

// Resend invitation
export async function resendInvitation(invitationId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/invitations/${invitationId}/resend`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to resend invitation',
      }
    }

    return {
      success: true,
      message: result?.message || 'Invitation resent successfully',
    }
  } catch (err) {
    console.error('Failed to resend invitation:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Verify invitation token
export async function verifyInvitation(token: string): Promise<ApiResponse<TeamInvitation>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/invitations/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ token }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Invalid or expired invitation',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Invitation verified successfully',
    }
  } catch (err) {
    console.error('Failed to verify invitation:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Accept invitation
export async function acceptInvitation(token: string): Promise<ApiResponse<TeamMember>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/invitations/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ token }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to accept invitation',
      }
    }

    return {
      success: true,
      data: result?.data || result,
      message: result?.message || 'Invitation accepted successfully',
    }
  } catch (err) {
    console.error('Failed to accept invitation:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Cancel/revoke invitation
export async function cancelInvitation(invitationId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/invitations/${invitationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to cancel invitation',
      }
    }

    return {
      success: true,
      message: result?.message || 'Invitation cancelled successfully',
    }
  } catch (err) {
    console.error('Failed to cancel invitation:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// ============================================
// TEAM MEMBERS
// ============================================

export interface GetTeamMembersParams {
  organization_id?: string
  pageNo?: number
  limitNo?: number
}

export interface PaginatedTeamMembers {
  members: TeamMember[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Get team members
export async function getTeamMembers(params: GetTeamMembersParams = {}): Promise<ApiResponse<PaginatedTeamMembers>> {
  try {
    const orgId = params.organization_id || getCurrentOrgId()
    
    const queryParams = new URLSearchParams()
    if (orgId) queryParams.append('organization_id', orgId)
    if (params.pageNo !== undefined) queryParams.append('pageNo', params.pageNo.toString())
    if (params.limitNo !== undefined) queryParams.append('limitNo', params.limitNo.toString())
    
    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/teams/members${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch team members',
      }
    }

    const members = result?.data?.members || result?.data || result?.members || result || []
    const total = result?.data?.total || result?.total || members.length
    const page = result?.data?.page || result?.page || params.pageNo || 1
    const limit = result?.data?.limit || result?.limit || params.limitNo || 10
    
    return {
      success: true,
      data: {
        members: Array.isArray(members) ? members : [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (err) {
    console.error('Failed to fetch team members:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Get single team member
export async function getTeamMember(memberId: string): Promise<ApiResponse<TeamMember>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/members/${memberId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch team member',
      }
    }

    return {
      success: true,
      data: result?.data || result,
    }
  } catch (err) {
    console.error('Failed to fetch team member:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Update member role
export async function updateTeamMemberRole(memberId: string, data: UpdateMemberRoleData, organizationId?: string): Promise<ApiResponse<TeamMember>> {
  try {
    const orgId = data.organization_id || organizationId || getCurrentOrgId()
    
    const response = await fetch(`${API_BASE_URL}/teams/members/${memberId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        organization_id: orgId,
        role: data.role,
      }),
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
      message: result?.message || 'Role updated successfully',
    }
  } catch (err) {
    console.error('Failed to update member role:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Remove team member
export async function removeTeamMember(memberId: string, organizationId?: string): Promise<ApiResponse<void>> {
  try {
    const orgId = organizationId || getCurrentOrgId()
    
    const response = await fetch(`${API_BASE_URL}/teams/members/${memberId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        organization_id: orgId,
      }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to remove team member',
      }
    }

    return {
      success: true,
      message: result?.message || 'Team member removed successfully',
    }
  } catch (err) {
    console.error('Failed to remove team member:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Suspend team member
export async function suspendTeamMember(memberId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/members/${memberId}/suspend`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to suspend team member',
      }
    }

    return {
      success: true,
      message: result?.message || 'Team member suspended successfully',
    }
  } catch (err) {
    console.error('Failed to suspend team member:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Reactivate team member
export async function reactivateTeamMember(memberId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/members/${memberId}/reactivate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to reactivate team member',
      }
    }

    return {
      success: true,
      message: result?.message || 'Team member reactivated successfully',
    }
  } catch (err) {
    console.error('Failed to reactivate team member:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// ============================================
// ROLES
// ============================================

// Get available roles
export async function getTeamRoles(organizationId?: string): Promise<ApiResponse<RoleDefinition[]>> {
  try {
    const orgId = organizationId || getCurrentOrgId()
    const queryParams = orgId ? `?organization_id=${orgId}` : ''
    
    const response = await fetch(`${API_BASE_URL}/teams/roles${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch roles',
      }
    }

    const roles = result?.data || result?.roles || result || []
    return {
      success: true,
      data: Array.isArray(roles) ? roles : [],
    }
  } catch (err) {
    console.error('Failed to fetch roles:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Get role permissions
export async function getRolePermissions(roleId: string): Promise<ApiResponse<string[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/roles/${roleId}/permissions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        error: result?.message || 'Failed to fetch role permissions',
      }
    }

    const permissions = result?.data || result?.permissions || result || []
    return {
      success: true,
      data: Array.isArray(permissions) ? permissions : [],
    }
  } catch (err) {
    console.error('Failed to fetch role permissions:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get role display info
export function getRoleInfo(role: TeamRole): { label: string; color: string; description: string } {
  const roleMap: Record<TeamRole, { label: string; color: string; description: string }> = {
    'OWNER': { 
      label: 'Owner', 
      color: 'bg-purple-100 text-purple-700',
      description: 'Full access to all features and settings'
    },
    'ADMIN': { 
      label: 'Admin', 
      color: 'bg-red-100 text-red-700',
      description: 'Can manage team members and most settings'
    },
    'CONTENT_MANAGER': { 
      label: 'Content Manager', 
      color: 'bg-blue-100 text-blue-700',
      description: 'Can create, edit, and publish content'
    },
    'CONTENT_CREATOR': { 
      label: 'Content Creator', 
      color: 'bg-green-100 text-green-700',
      description: 'Can create and edit content, submit for approval'
    },
    'SOCIAL_RESPONDER': { 
      label: 'Social Responder', 
      color: 'bg-yellow-100 text-yellow-700',
      description: 'Can respond to comments and messages'
    },
    'ANALYST': { 
      label: 'Analyst', 
      color: 'bg-indigo-100 text-indigo-700',
      description: 'Can view analytics and generate reports'
    },
    'VIEWER': { 
      label: 'Viewer', 
      color: 'bg-gray-100 text-gray-700',
      description: 'Read-only access to content and analytics'
    },
  }
  return roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-700', description: '' }
}

// Format member name
export function formatMemberName(member: TeamMember): string {
  if (member.name) return member.name
  if (member.first_name || member.last_name) {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim()
  }
  return member.email.split('@')[0]
}

// Get member initials
export function getMemberInitials(member: TeamMember): string {
  const name = formatMemberName(member)
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

