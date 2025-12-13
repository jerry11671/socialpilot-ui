'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, UserPlus, Mail, MoreHorizontal, User, Crown, Settings as SettingsIcon } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive?: string
}

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState('OWNER')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'OWNER',
      status: 'active',
      joinedAt: '2024-01-15',
      lastActive: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'ADMIN',
      status: 'active',
      joinedAt: '2024-01-20',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'CONTENT_MANAGER',
      status: 'active',
      joinedAt: '2024-02-01',
      lastActive: '3 hours ago'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      role: 'CONTENT_CREATOR',
      status: 'pending',
      joinedAt: '2024-02-10'
    }
  ])

  const [pendingInvitations, setPendingInvitations] = useState([
    {
      id: '1',
      email: 'newuser@example.com',
      role: 'CONTENT_CREATOR',
      invitedBy: 'John Doe',
      invitedAt: '2024-02-12',
      status: 'pending'
    }
  ])

  const canInvite = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN'

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-purple-100 text-purple-700'
      case 'ADMIN': return 'bg-red-100 text-red-700'
      case 'CONTENT_MANAGER': return 'bg-blue-100 text-blue-700'
      case 'CONTENT_CREATOR': return 'bg-green-100 text-green-700'
      case 'SOCIAL_RESPONDER': return 'bg-yellow-100 text-yellow-700'
      case 'ANALYST': return 'bg-indigo-100 text-indigo-700'
      case 'EMPLOYEE_ADVOCATE': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 mt-1">Manage your team members and permissions</p>
        </div>
        {canInvite && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>Invitations waiting for acceptance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-yellow-200 bg-yellow-50"
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Invited as {invitation.role.replace('_', ' ').toLowerCase()} by {invitation.invitedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Resend
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      {member.role === 'OWNER' && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {member.lastActive && (
                      <p className="text-xs text-gray-400">Last active: {member.lastActive}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getRoleColor(member.role)}>
                    {getRoleIcon(member.role)}
                    <span className="ml-1">{member.role.replace('_', ' ')}</span>
                  </Badge>
                  <Badge className={getStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                  {member.role !== 'OWNER' && (
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Understanding access levels for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                role: 'Owner',
                description: 'Full system access, can manage organization settings and billing',
                color: 'bg-purple-100 text-purple-700',
              },
              {
                role: 'Admin',
                description: 'Full access except billing and owner-level settings',
                color: 'bg-red-100 text-red-700',
              },
              {
                role: 'Content Manager',
                description: 'Create, edit, delete content; view analytics; manage team collaboration',
                color: 'bg-blue-100 text-blue-700',
              },
              {
                role: 'Content Creator',
                description: 'Create and edit own content; submit for approval; limited analytics',
                color: 'bg-green-100 text-green-700',
              },
              {
                role: 'Social Responder',
                description: 'Full inbox access; respond to messages; no content scheduling',
                color: 'bg-yellow-100 text-yellow-700',
              },
              {
                role: 'Analyst',
                description: 'Read-only access to content and analytics; full reporting access',
                color: 'bg-indigo-100 text-indigo-700',
              },
              {
                role: 'Employee Advocate',
                description: 'Limited to Amplify module; share approved content to personal accounts',
                color: 'bg-pink-100 text-pink-700',
              },
            ].map((roleInfo) => (
              <div
                key={roleInfo.role}
                className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">{roleInfo.role}</h3>
                </div>
                <p className="text-sm text-gray-600">{roleInfo.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to join your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none">
                  <option>Content Creator</option>
                  <option>Content Manager</option>
                  <option>Social Responder</option>
                  <option>Analyst</option>
                  <option>Employee Advocate</option>
                  {currentUserRole === 'OWNER' && <option>Admin</option>}
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Send Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}