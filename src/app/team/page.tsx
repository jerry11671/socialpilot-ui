'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, UserPlus, Mail, MoreHorizontal, User, Crown, Settings as SettingsIcon, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import {
  getTeamMembers,
  getPendingInvitations,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  resendInvitation,
  cancelInvitation,
  TeamMember,
  TeamInvitation,
  getCurrentOrgId,
} from '@/lib/api/teams'
import { getOrganizations } from '@/lib/api/organizations'

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<string>('VIEWER')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)
  const [isInviting, setIsInviting] = useState(false)
  
  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'SOCIAL_RESPONDER' as TeamMember['role'],
  })

  const canInvite = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN'

  // Fetch current organization ID
  useEffect(() => {
    const orgId = getCurrentOrgId()
    setCurrentOrgId(orgId)
    
    // If no org ID, try to get it from organizations
    if (!orgId) {
      getOrganizations().then(result => {
        if (result.success && result.data && result.data.length > 0) {
          const firstOrg = result.data[0]
          setCurrentOrgId(firstOrg.id)
          if (typeof window !== 'undefined') {
            localStorage.setItem('current_org_id', firstOrg.id)
          }
        }
      })
    }
  }, [])

  // Fetch team data
  const fetchTeamData = useCallback(async () => {
    if (!currentOrgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch team members and invitations in parallel
      const [membersResult, invitationsResult] = await Promise.all([
        getTeamMembers({ organization_id: currentOrgId, pageNo: 1, limitNo: 100 }),
        getPendingInvitations({ organization_id: currentOrgId }),
      ])

      if (membersResult.success && membersResult.data) {
        setTeamMembers(membersResult.data.members)
        
        // Determine current user's role from the members list
        // Find the current user in the team members list
        const currentUserEmail = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('user') || '{}')?.email 
          : null
        
        if (currentUserEmail) {
          const currentUserMember = membersResult.data.members.find(
            (member: TeamMember) => member.email === currentUserEmail
          )
          if (currentUserMember) {
            setCurrentUserRole(currentUserMember.role)
          }
        }
      } else {
        setError(membersResult.error || 'Failed to load team members')
      }

      if (invitationsResult.success && invitationsResult.data) {
        setPendingInvitations(invitationsResult.data)
      }
    } catch (err) {
      console.error('Failed to fetch team data:', err)
      setError('Failed to load team data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [currentOrgId])

  useEffect(() => {
    fetchTeamData()
  }, [fetchTeamData])

  // Handle invite team member
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrgId) {
      setError('Please select an organization first')
      return
    }

    setIsInviting(true)
    setError(null)

    try {
      const result = await inviteTeamMember({
        email: inviteForm.email,
        role: inviteForm.role,
      }, currentOrgId)

      if (result.success) {
        setShowInviteModal(false)
        setInviteForm({ email: '', role: 'SOCIAL_RESPONDER' })
        fetchTeamData() // Refresh data
      } else {
        setError(result.error || 'Failed to send invitation')
      }
    } catch (err) {
      console.error('Failed to invite member:', err)
      setError('Failed to send invitation. Please try again.')
    } finally {
      setIsInviting(false)
    }
  }

  // Handle update role
  const handleUpdateRole = async (memberId: string, newRole: TeamMember['role']) => {
    if (!currentOrgId) return

    try {
      const result = await updateTeamMemberRole(memberId, {
        organization_id: currentOrgId,
        role: newRole,
      })

      if (result.success) {
        fetchTeamData() // Refresh data
      } else {
        setError(result.error || 'Failed to update role')
      }
    } catch (err) {
      console.error('Failed to update role:', err)
      setError('Failed to update role. Please try again.')
    }
  }

  // Handle remove member
  const handleRemoveMember = async (memberId: string) => {
    if (!currentOrgId) return
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      const result = await removeTeamMember(memberId, currentOrgId)

      if (result.success) {
        fetchTeamData() // Refresh data
      } else {
        setError(result.error || 'Failed to remove member')
      }
    } catch (err) {
      console.error('Failed to remove member:', err)
      setError('Failed to remove member. Please try again.')
    }
  }

  // Handle resend invitation
  const handleResendInvitation = async (invitationId: string) => {
    try {
      const result = await resendInvitation(invitationId)
      if (result.success) {
        fetchTeamData() // Refresh data
      } else {
        setError(result.error || 'Failed to resend invitation')
      }
    } catch (err) {
      console.error('Failed to resend invitation:', err)
      setError('Failed to resend invitation. Please try again.')
    }
  }

  // Handle cancel invitation
  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return

    try {
      const result = await cancelInvitation(invitationId)
      if (result.success) {
        fetchTeamData() // Refresh data
      } else {
        setError(result.error || 'Failed to cancel invitation')
      }
    } catch (err) {
      console.error('Failed to cancel invitation:', err)
      setError('Failed to cancel invitation. Please try again.')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'OWNER': return 'bg-purple-100 text-purple-700'
      case 'ADMIN': return 'bg-red-100 text-red-700'
      case 'CONTENT_MANAGER': return 'bg-blue-100 text-blue-700'
      case 'CONTENT_CREATOR': return 'bg-green-100 text-green-700'
      case 'SOCIAL_RESPONDER': return 'bg-yellow-100 text-yellow-700'
      case 'ANALYST': return 'bg-indigo-100 text-indigo-700'
      case 'VIEWER': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toUpperCase()) {
      case 'OWNER': return <Crown className="h-4 w-4" />
      case 'ADMIN': return <SettingsIcon className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!currentOrgId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please select an organization first</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team members and their roles</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchTeamData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canInvite && (
            <Button
              onClick={() => setShowInviteModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Active Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Active Members ({teamMembers.length})</CardTitle>
          <CardDescription>Team members who have joined your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No team members yet</p>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      {member.image || member.avatar ? (
                        <img
                          src={member.image || member.avatar}
                          alt={member.name || member.email}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleColor(member.role)}>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </div>
                    </Badge>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    {(currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') && member.role !== 'OWNER' && (
                      <div className="flex items-center gap-2">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value as TeamMember['role'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="CONTENT_MANAGER">Content Manager</option>
                          <option value="CONTENT_CREATOR">Content Creator</option>
                          <option value="SOCIAL_RESPONDER">Social Responder</option>
                          <option value="ANALYST">Analyst</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations ({pendingInvitations.length})</CardTitle>
            <CardDescription>Team members who have been invited but not yet joined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Invited {invitation.invited_at || invitation.invitedAt ? new Date(invitation.invited_at || invitation.invitedAt!).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleColor(invitation.role)}>
                      {invitation.role}
                    </Badge>
                    <Badge className={getStatusColor(invitation.status)}>
                      {invitation.status}
                    </Badge>
                    {canInvite && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id)}
                        >
                          Resend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to a new team member</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="member@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as TeamMember['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="SOCIAL_RESPONDER">Social Responder</option>
                    <option value="CONTENT_CREATOR">Content Creator</option>
                    <option value="CONTENT_MANAGER">Content Manager</option>
                    <option value="ANALYST">Analyst</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isInviting}
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
