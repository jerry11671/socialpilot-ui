'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VoiceInputButton } from '@/components/ui/VoiceInputButton'
import {
  Building2,
  Plus,
  Users,
  Settings,
  Trash2,
  Edit,
  Shield,
  Crown,
  UserPlus,
  Mail,
  Globe,
  Loader2,
  MoreVertical,
  Check,
  X,
  Key,
  Link2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  History,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react'
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  inviteMember,
  removeMember,
  updateMemberRole,
  configureSSOConfig,
  validateSSOConfig,
  updateSSOSettings,
  getSSOSettings,
  getSSOAuditLogs,
  disableSSO,
  switchOrganization,
  getCurrentOrgId,
  Organization,
  OrganizationMember,
  SSOValidationResult,
  SSOSettingsData,
  SSOAuditLog,
} from '@/lib/api/organizations'

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showSSOModal, setShowSSOModal] = useState(false)
  const [showSSOSettingsModal, setShowSSOSettingsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    timezone: 'UTC',
    language: 'English',
    logo: '',
    brand_voice: '',
    brand_guidelines: '',
    primary_color: '#106B81',
    secondary_color: '#059669',
  })
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member' as 'admin' | 'member' | 'viewer',
    message: '',
  })
  const [ssoData, setSSOData] = useState({
    type: 'SAML2.0' as 'SAML2.0' | 'OIDC',
    configMode: 'url' as 'url' | 'manual',
    idp_metadata_url: '',
    sso_domains: '',
    // Manual metadata fields
    entityID: '',
    ssoUrl: '',
    ssoBinding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
    x509cert: '',
  })
  const [ssoStep, setSSOStep] = useState<'configure' | 'validate'>('configure')
  const [ssoValidation, setSSOValidation] = useState<SSOValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // SSO Settings state
  const [ssoSettings, setSSOSettings] = useState<SSOSettingsData & { enabled?: boolean }>({
    enforce_sso: false,
    sso_domains: [],
    enabled: false,
  })
  const [ssoDomainsInput, setSSODomainsInput] = useState('')
  const [isLoadingSSOSettings, setIsLoadingSSOSettings] = useState(false)
  const [isDisablingSSO, setIsDisablingSSO] = useState(false)
  
  // SSO Audit Logs state
  const [ssoSettingsTab, setSSOSettingsTab] = useState<'settings' | 'audit'>('settings')
  const [auditLogs, setAuditLogs] = useState<SSOAuditLog[]>([])
  const [auditLogsTotal, setAuditLogsTotal] = useState(0)
  const [auditLogsPage, setAuditLogsPage] = useState(0)
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false)
  const AUDIT_LOGS_LIMIT = 10

  // Fetch organizations
  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await getOrganizations()
    if (result.success && result.data) {
      setOrganizations(result.data)
      // Select the first org or the current org
      const currentId = getCurrentOrgId()
      setCurrentOrgId(currentId)
      const current = result.data.find(o => o.id === currentId) || result.data[0]
      if (current && !selectedOrg) {
        setSelectedOrg(current)
      }
    } else {
      setError(result.error || 'Failed to load organizations')
    }

    setIsLoading(false)
  }, [selectedOrg])

  // Fetch members for selected org
  const fetchMembers = useCallback(async (orgId: string) => {
    setIsLoadingMembers(true)
    const result = await getOrganizationMembers(orgId)
    if (result.success && result.data) {
      setMembers(result.data)
    }
    setIsLoadingMembers(false)
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  useEffect(() => {
    if (selectedOrg) {
      fetchMembers(selectedOrg.id)
    }
  }, [selectedOrg, fetchMembers])

  // Create organization
  const handleCreateOrg = async () => {
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    const result = await createOrganization(formData)
    
    if (result.success && result.data) {
      setOrganizations(prev => [...prev, result.data!])
      setSelectedOrg(result.data)
      setShowCreateModal(false)
      setFormData({ name: '', description: '', website: '', industry: '', size: '', timezone: 'UTC', language: 'English', logo: '', brand_voice: '', brand_guidelines: '', primary_color: '#106B81', secondary_color: '#059669' })
    } else {
      setError(result.error || 'Failed to create organization')
    }
    setIsSubmitting(false)
  }

  // Update organization
  const handleUpdateOrg = async () => {
    if (!selectedOrg || !formData.name.trim()) return

    setIsSubmitting(true)
    const result = await updateOrganization(selectedOrg.id, formData)
    
    if (result.success && result.data) {
      setOrganizations(prev => prev.map(o => o.id === selectedOrg.id ? result.data! : o))
      setSelectedOrg(result.data)
      setShowEditModal(false)
    } else {
      setError(result.error || 'Failed to update organization')
    }
    setIsSubmitting(false)
  }

  // Delete organization
  const handleDeleteOrg = async () => {
    if (!selectedOrg) return

    setIsSubmitting(true)
    const result = await deleteOrganization(selectedOrg.id)
    
    if (result.success) {
      setOrganizations(prev => prev.filter(o => o.id !== selectedOrg.id))
      setSelectedOrg(organizations[0] || null)
      setShowDeleteConfirm(false)
    } else {
      setError(result.error || 'Failed to delete organization')
    }
    setIsSubmitting(false)
  }

  // Invite member
  const handleInviteMember = async () => {
    if (!selectedOrg || !inviteData.email.trim()) return

    setIsSubmitting(true)
    const result = await inviteMember(selectedOrg.id, inviteData)
    
    if (result.success) {
      fetchMembers(selectedOrg.id)
      setShowInviteModal(false)
      setInviteData({ email: '', role: 'member', message: '' })
    } else {
      setError(result.error || 'Failed to invite member')
    }
    setIsSubmitting(false)
  }

  // Remove member
  const handleRemoveMember = async (memberId: string) => {
    if (!selectedOrg) return

    const result = await removeMember(selectedOrg.id, memberId)
    if (result.success) {
      setMembers(prev => prev.filter(m => m.id !== memberId))
    } else {
      setError(result.error || 'Failed to remove member')
    }
  }

  // Update member role
  const handleUpdateRole = async (memberId: string, role: string) => {
    if (!selectedOrg) return

    const result = await updateMemberRole(selectedOrg.id, memberId, role)
    if (result.success) {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: role as any } : m))
    } else {
      setError(result.error || 'Failed to update role')
    }
  }

  // Configure SSO
  const handleConfigureSSO = async () => {
    if (!selectedOrg) return

    // Validate based on config mode
    if (ssoData.configMode === 'url' && !ssoData.idp_metadata_url.trim()) {
      setError('Please enter the IdP Metadata URL')
      return
    }
    if (ssoData.configMode === 'manual') {
      if (!ssoData.entityID.trim() || !ssoData.ssoUrl.trim() || !ssoData.x509cert.trim()) {
        setError('Please fill in all required fields for manual configuration')
        return
      }
    }

    setIsSubmitting(true)
    setError(null)

    // Build the request body based on config mode
    const requestBody: any = {
      type: ssoData.type,
      sso_domains: ssoData.sso_domains.split(',').map(d => d.trim()).filter(Boolean),
    }

    if (ssoData.configMode === 'url') {
      requestBody.idp_metadata_url = ssoData.idp_metadata_url
    } else {
      requestBody.idp_metadata = {
        entityID: ssoData.entityID,
        singleSignOnService: {
          url: ssoData.ssoUrl,
          binding: ssoData.ssoBinding,
        },
        x509cert: ssoData.x509cert,
      }
    }

    const result = await configureSSOConfig(selectedOrg.id, requestBody)
    
    if (result.success) {
      // Move to validation step
      setSSOStep('validate')
      setSSOValidation(null)
    } else {
      setError(result.error || 'Failed to configure SSO')
    }
    setIsSubmitting(false)
  }

  // Validate and enable SSO
  const handleValidateSSO = async () => {
    if (!selectedOrg) return

    setIsValidating(true)
    setError(null)
    setSSOValidation(null)

    const result = await validateSSOConfig(selectedOrg.id)
    
    if (result.success && result.data) {
      setSSOValidation(result.data)
      
      if (result.data.valid && result.data.enabled) {
        // SSO is now enabled, close modal after a short delay
        setTimeout(() => {
          closeSSOModal()
          fetchOrganizations()
        }, 2000)
      }
    } else {
      setSSOValidation({
        valid: false,
        errors: [result.error || 'Validation failed'],
      })
    }
    setIsValidating(false)
  }

  // Close SSO modal and reset state
  const closeSSOModal = () => {
    setShowSSOModal(false)
    setSSOStep('configure')
    setSSOValidation(null)
    setSSOData({
      type: 'SAML2.0',
      configMode: 'url',
      idp_metadata_url: '',
      sso_domains: '',
      entityID: '',
      ssoUrl: '',
      ssoBinding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      x509cert: '',
    })
  }

  // Open SSO Settings modal
  const openSSOSettingsModal = async () => {
    if (!selectedOrg) return
    
    setShowSSOSettingsModal(true)
    setIsLoadingSSOSettings(true)
    setError(null)
    
    const result = await getSSOSettings(selectedOrg.id)
    
    if (result.success && result.data) {
      setSSOSettings(result.data)
      setSSODomainsInput(result.data.sso_domains?.join(', ') || '')
    } else {
      // Default values if no settings found
      setSSOSettings({
        enforce_sso: false,
        sso_domains: [],
        enabled: selectedOrg.sso_enabled || false,
      })
      setSSODomainsInput('')
    }
    setIsLoadingSSOSettings(false)
  }

  // Update SSO Settings
  const handleUpdateSSOSettings = async () => {
    if (!selectedOrg) return

    setIsSubmitting(true)
    setError(null)

    const domains = ssoDomainsInput
      .split(',')
      .map(d => d.trim())
      .filter(Boolean)

    const result = await updateSSOSettings(selectedOrg.id, {
      enforce_sso: ssoSettings.enforce_sso,
      sso_domains: domains,
    })
    
    if (result.success) {
      setShowSSOSettingsModal(false)
      fetchOrganizations()
    } else {
      setError(result.error || 'Failed to update SSO settings')
    }
    setIsSubmitting(false)
  }

  // Disable SSO
  const handleDisableSSO = async () => {
    if (!selectedOrg) return

    setIsDisablingSSO(true)
    setError(null)

    const result = await disableSSO(selectedOrg.id)
    
    if (result.success) {
      setShowSSOSettingsModal(false)
      fetchOrganizations()
    } else {
      setError(result.error || 'Failed to disable SSO')
    }
    setIsDisablingSSO(false)
  }

  // Fetch SSO Audit Logs
  const fetchAuditLogs = async (page: number = 0) => {
    if (!selectedOrg) return

    setIsLoadingAuditLogs(true)
    
    const result = await getSSOAuditLogs(selectedOrg.id, {
      limit: AUDIT_LOGS_LIMIT,
      skip: page * AUDIT_LOGS_LIMIT,
    })
    
    if (result.success && result.data) {
      setAuditLogs(result.data.logs)
      setAuditLogsTotal(result.data.total)
      setAuditLogsPage(page)
    }
    setIsLoadingAuditLogs(false)
  }

  // Format audit log action for display
  const formatAuditAction = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      'sso_configured': { label: 'SSO Configured', color: 'bg-blue-100 text-blue-800' },
      'sso_enabled': { label: 'SSO Enabled', color: 'bg-emerald-100 text-emerald-800' },
      'sso_disabled': { label: 'SSO Disabled', color: 'bg-red-100 text-red-800' },
      'sso_validated': { label: 'SSO Validated', color: 'bg-purple-100 text-purple-800' },
      'settings_updated': { label: 'Settings Updated', color: 'bg-amber-100 text-amber-800' },
      'domains_updated': { label: 'Domains Updated', color: 'bg-cyan-100 text-cyan-800' },
      'enforce_enabled': { label: 'Enforcement Enabled', color: 'bg-orange-100 text-orange-800' },
      'enforce_disabled': { label: 'Enforcement Disabled', color: 'bg-gray-100 text-gray-800' },
      'login_success': { label: 'SSO Login', color: 'bg-emerald-100 text-emerald-800' },
      'login_failed': { label: 'SSO Login Failed', color: 'bg-red-100 text-red-800' },
    }
    return actionMap[action] || { label: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), color: 'bg-gray-100 text-gray-800' }
  }

  // Format date for audit logs
  const formatAuditDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  // Switch organization
  const handleSwitchOrg = async (org: Organization) => {
    const result = await switchOrganization(org.id)
    if (result.success) {
      setCurrentOrgId(org.id)
      setSelectedOrg(org)
    }
  }

  // Open edit modal with current data
  const openEditModal = () => {
    if (selectedOrg) {
      setFormData({
        name: selectedOrg.name || '',
        description: selectedOrg.description || '',
        website: selectedOrg.website || '',
        industry: selectedOrg.industry || '',
        size: selectedOrg.size || '',
        timezone: selectedOrg.timezone || 'UTC',
        language: selectedOrg.language || 'English',
        logo: selectedOrg.logo || '',
        brand_voice: selectedOrg.brand_voice || '',
        brand_guidelines: selectedOrg.brand_guidelines || '',
        primary_color: selectedOrg.primary_color || '#106B81',
        secondary_color: selectedOrg.secondary_color || '#059669',
      })
      setShowEditModal(true)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'member': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-3 w-3" />
      case 'admin': return <Shield className="h-3 w-3" />
      default: return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your organizations and team members</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            setFormData({ name: '', description: '', website: '', industry: '', size: '', timezone: 'UTC', language: 'English', logo: '', brand_voice: '', brand_guidelines: '', primary_color: '#106B81', secondary_color: '#059669' })
            setShowCreateModal(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Organizations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Your Organizations</CardTitle>
            <CardDescription>Select an organization to manage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {organizations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Building2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No organizations yet</p>
                <p className="text-xs mt-1">Create your first organization to get started</p>
              </div>
            ) : (
              organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedOrg?.id === org.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{org.name}</p>
                      <p className="text-xs text-gray-500">
                        {org.members_count || 0} members
                      </p>
                    </div>
                    {currentOrgId === org.id && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">Active</Badge>
                    )}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card className="lg:col-span-2">
          {selectedOrg ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedOrg.name}</CardTitle>
                      <CardDescription>{selectedOrg.description || 'No description'}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentOrgId !== selectedOrg.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwitchOrg(selectedOrg)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Switch
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={openEditModal}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedOrg.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 truncate">
                        {selectedOrg.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {selectedOrg.industry && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Industry:</span> {selectedOrg.industry}
                    </div>
                  )}
                  {selectedOrg.size && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {selectedOrg.size}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {selectedOrg.sso_enabled ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openSSOSettingsModal}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <Key className="mr-1 h-4 w-4" />
                        SSO Settings
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSSOModal(true)}
                      >
                        <Key className="mr-1 h-4 w-4" />
                        Configure SSO
                      </Button>
                    )}
                  </div>
                </div>

                {/* Members Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Team Members</h3>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setShowInviteModal(true)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Member
                    </Button>
                  </div>

                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No members yet</p>
                      <p className="text-xs mt-1">Invite team members to collaborate</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              {member.user?.image ? (
                                <img src={member.user.image} alt="" className="h-10 w-10 rounded-full" />
                              ) : (
                                <span className="text-sm font-medium text-emerald-600">
                                  {(member.user?.name || member.user?.email || 'U').charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.user?.name || member.user?.first_name || member.user?.email || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500">{member.user?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getRoleColor(member.role)} flex items-center gap-1`}>
                              {getRoleIcon(member.role)}
                              {member.role}
                            </Badge>
                            {member.role !== 'owner' && (
                              <div className="relative group">
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                  <button
                                    onClick={() => handleUpdateRole(member.id, member.role === 'admin' ? 'member' : 'admin')}
                                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                                  >
                                    {member.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[400px]">
              <div className="text-center text-gray-400">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select an organization to view details</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Create/Edit Organization Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{showCreateModal ? 'Create Organization' : 'Edit Organization'}</CardTitle>
              <CardDescription>
                {showCreateModal ? 'Set up a new organization for your team' : 'Update organization details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Company"
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceInputButton
                      onTranscript={(text) => setFormData(prev => ({ ...prev, name: text }))}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What does your organization do?"
                    className="w-full h-20 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                  <div className="absolute bottom-3 right-3">
                    <VoiceInputButton
                      onTranscript={(text) => setFormData(prev => ({ ...prev, description: prev.description ? `${prev.description} ${text}` : text }))}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media">Media & Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Europe/Berlin">Berlin (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                    <option value="Asia/Singapore">Singapore (SGT)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                    <option value="Africa/Lagos">Lagos (WAT)</option>
                    <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Italian">Italian</option>
                    <option value="Dutch">Dutch</option>
                    <option value="Russian">Russian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>

              {/* Branding Section - Only show in Edit mode */}
              {showEditModal && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Branding</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Voice</label>
                    <div className="relative">
                      <textarea
                        value={formData.brand_voice}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand_voice: e.target.value }))}
                        placeholder="Professional, friendly, and innovative"
                        rows={2}
                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      />
                      <div className="absolute bottom-3 right-3">
                        <VoiceInputButton
                          onTranscript={(text) => setFormData(prev => ({ ...prev, brand_voice: prev.brand_voice ? `${prev.brand_voice} ${text}` : text }))}
                          size="sm"
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Describe your brand's tone and personality</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Guidelines</label>
                    <div className="relative">
                      <textarea
                        value={formData.brand_guidelines}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand_guidelines: e.target.value }))}
                        placeholder="Use our brand colors consistently. Primary color for headers, secondary for accents."
                        rows={3}
                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      />
                      <div className="absolute bottom-3 right-3">
                        <VoiceInputButton
                          onTranscript={(text) => setFormData(prev => ({ ...prev, brand_guidelines: prev.brand_guidelines ? `${prev.brand_guidelines} ${text}` : text }))}
                          size="sm"
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Guidelines for content creation and visual consistency</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.primary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.primary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                          placeholder="#106B81"
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                          className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                          placeholder="#059669"
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Preview:</span>
                    <div 
                      className="h-8 w-16 rounded"
                      style={{ backgroundColor: formData.primary_color }}
                    />
                    <div 
                      className="h-8 w-16 rounded"
                      style={{ backgroundColor: formData.secondary_color }}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={showCreateModal ? handleCreateOrg : handleUpdateOrg}
                  disabled={isSubmitting || !formData.name.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {showCreateModal ? 'Create' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to join {selectedOrg?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="colleague@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="viewer">Viewer - Can view content</option>
                  <option value="member">Member - Can create and edit</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (optional)</label>
                <div className="relative">
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Hey! Join our team..."
                    className="w-full h-20 p-3 pr-12 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                  <div className="absolute bottom-3 right-3">
                    <VoiceInputButton
                      onTranscript={(text) => setInviteData(prev => ({ ...prev, message: prev.message ? `${prev.message} ${text}` : text }))}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleInviteMember}
                  disabled={isSubmitting || !inviteData.email.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SSO Configuration Modal */}
      {showSSOModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-lg my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    {ssoStep === 'configure' ? 'Configure SSO' : 'Validate SSO'}
                  </CardTitle>
                  <CardDescription>
                    {ssoStep === 'configure' 
                      ? `Set up Single Sign-On for ${selectedOrg?.name}`
                      : 'Test and enable your SSO configuration'
                    }
                  </CardDescription>
                </div>
                {/* Step Indicator */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    ssoStep === 'configure' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {ssoStep === 'validate' ? <Check className="h-3 w-3" /> : '1'}
                  </div>
                  <div className="w-8 h-0.5 bg-gray-200" />
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    ssoStep === 'validate' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 1: Configuration */}
              {ssoStep === 'configure' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SSO Type</label>
                    <select
                      value={ssoData.type}
                      onChange={(e) => setSSOData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="SAML2.0">SAML 2.0</option>
                      <option value="OIDC">OpenID Connect (OIDC)</option>
                    </select>
                  </div>

                  {/* Configuration Method Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Method</label>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setSSOData(prev => ({ ...prev, configMode: 'url' }))}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                          ssoData.configMode === 'url'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Metadata URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setSSOData(prev => ({ ...prev, configMode: 'manual' }))}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                          ssoData.configMode === 'manual'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Manual Entry
                      </button>
                    </div>
                  </div>

                  {/* URL-based Configuration */}
                  {ssoData.configMode === 'url' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IdP Metadata URL *
                      </label>
                      <input
                        type="url"
                        value={ssoData.idp_metadata_url}
                        onChange={(e) => setSSOData(prev => ({ ...prev, idp_metadata_url: e.target.value }))}
                        placeholder="https://idp.example.com/metadata.xml"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        The URL where your Identity Provider's metadata can be found
                      </p>
                    </div>
                  )}

                  {/* Manual Metadata Configuration */}
                  {ssoData.configMode === 'manual' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Entity ID *
                        </label>
                        <input
                          type="text"
                          value={ssoData.entityID}
                          onChange={(e) => setSSOData(prev => ({ ...prev, entityID: e.target.value }))}
                          placeholder="https://idp.example.com"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          The unique identifier for your Identity Provider
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Single Sign-On URL *
                        </label>
                        <input
                          type="url"
                          value={ssoData.ssoUrl}
                          onChange={(e) => setSSOData(prev => ({ ...prev, ssoUrl: e.target.value }))}
                          placeholder="https://idp.example.com/sso"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          The URL where users will be redirected for authentication
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SSO Binding
                        </label>
                        <select
                          value={ssoData.ssoBinding}
                          onChange={(e) => setSSOData(prev => ({ ...prev, ssoBinding: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect">HTTP-Redirect</option>
                          <option value="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">HTTP-POST</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          The SAML binding type for authentication requests
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          X.509 Certificate *
                        </label>
                        <textarea
                          value={ssoData.x509cert}
                          onChange={(e) => setSSOData(prev => ({ ...prev, x509cert: e.target.value }))}
                          placeholder="MIIC..."
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono text-sm resize-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          The public certificate from your Identity Provider (without BEGIN/END markers)
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SSO Domains
                    </label>
                    <input
                      type="text"
                      value={ssoData.sso_domains}
                      onChange={(e) => setSSOData(prev => ({ ...prev, sso_domains: e.target.value }))}
                      placeholder="example.com, company.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Comma-separated list of email domains that will use SSO
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={closeSSOModal}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleConfigureSSO}
                      disabled={isSubmitting || (
                        ssoData.configMode === 'url' 
                          ? !ssoData.idp_metadata_url.trim()
                          : !ssoData.entityID.trim() || !ssoData.ssoUrl.trim() || !ssoData.x509cert.trim()
                      )}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-4 w-4" />
                      )}
                      Save Configuration
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Validation */}
              {ssoStep === 'validate' && (
                <>
                  <div className="text-center py-4">
                    <div className="mb-4">
                      {!ssoValidation && !isValidating && (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                          <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                      )}
                      {isValidating && (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                        </div>
                      )}
                      {ssoValidation?.valid && (
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                      )}
                      {ssoValidation && !ssoValidation.valid && (
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {!ssoValidation && !isValidating && 'Ready to Validate'}
                      {isValidating && 'Validating Configuration...'}
                      {ssoValidation?.valid && ssoValidation?.enabled && 'SSO Enabled Successfully!'}
                      {ssoValidation?.valid && !ssoValidation?.enabled && 'Configuration Valid'}
                      {ssoValidation && !ssoValidation.valid && 'Validation Failed'}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      {!ssoValidation && !isValidating && 'Click the button below to test your SSO configuration and enable it.'}
                      {isValidating && 'Please wait while we verify your identity provider settings...'}
                      {ssoValidation?.valid && ssoValidation?.enabled && 'Your SSO configuration has been validated and is now active.'}
                      {ssoValidation?.valid && !ssoValidation?.enabled && 'Your configuration is valid. Click enable to activate SSO.'}
                      {ssoValidation && !ssoValidation.valid && 'There were issues with your SSO configuration.'}
                    </p>
                  </div>

                  {/* Validation Details */}
                  {ssoValidation?.details && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      {ssoValidation.details.entityID && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Entity ID:</span>
                          <span className="text-gray-900 font-mono text-xs truncate max-w-[200px]">
                            {ssoValidation.details.entityID}
                          </span>
                        </div>
                      )}
                      {ssoValidation.details.ssoUrl && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">SSO URL:</span>
                          <span className="text-gray-900 font-mono text-xs truncate max-w-[200px]">
                            {ssoValidation.details.ssoUrl}
                          </span>
                        </div>
                      )}
                      {ssoValidation.details.certificate_valid !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Certificate:</span>
                          <span className={ssoValidation.details.certificate_valid ? 'text-emerald-600' : 'text-red-600'}>
                            {ssoValidation.details.certificate_valid ? 'Valid' : 'Invalid'}
                          </span>
                        </div>
                      )}
                      {ssoValidation.details.domains_configured && ssoValidation.details.domains_configured.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Domains:</span>
                          <span className="text-gray-900">
                            {ssoValidation.details.domains_configured.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Validation Errors */}
                  {ssoValidation?.errors && ssoValidation.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Errors:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {ssoValidation.errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-700">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSSOStep('configure')
                        setSSOValidation(null)
                      }}
                    >
                      Back to Configuration
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={closeSSOModal}>
                        {ssoValidation?.valid && ssoValidation?.enabled ? 'Done' : 'Cancel'}
                      </Button>
                      {(!ssoValidation || !ssoValidation.valid || !ssoValidation.enabled) && (
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleValidateSSO}
                          disabled={isValidating}
                        >
                          {isValidating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                          )}
                          {ssoValidation && !ssoValidation.valid ? 'Retry Validation' : 'Validate & Enable'}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Organization</CardTitle>
              <CardDescription>
                Are you sure you want to delete "{selectedOrg?.name}"? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteOrg}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SSO Settings Modal */}
      {showSSOSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    SSO Management
                  </CardTitle>
                  <CardDescription>
                    Manage Single Sign-On for {selectedOrg?.name}
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Enabled
                </Badge>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mt-4">
                <button
                  onClick={() => setSSOSettingsTab('settings')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    ssoSettingsTab === 'settings'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="inline-block h-4 w-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setSSOSettingsTab('audit')
                    if (auditLogs.length === 0) {
                      fetchAuditLogs(0)
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    ssoSettingsTab === 'audit'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <History className="inline-block h-4 w-4 mr-2" />
                  Audit Logs
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Settings Tab */}
              {ssoSettingsTab === 'settings' && (
                <>
                  {isLoadingSSOSettings ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    <>
                      {/* Enforce SSO Toggle */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Enforce SSO</h4>
                          <p className="text-sm text-gray-500">
                            Require all users with matching domains to sign in via SSO
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSSOSettings(prev => ({ ...prev, enforce_sso: !prev.enforce_sso }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            ssoSettings.enforce_sso ? 'bg-emerald-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              ssoSettings.enforce_sso ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* SSO Domains */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SSO Domains
                        </label>
                        <input
                          type="text"
                          value={ssoDomainsInput}
                          onChange={(e) => setSSODomainsInput(e.target.value)}
                          placeholder="example.com, company.com, subsidiary.com"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Comma-separated list of email domains that will use SSO
                        </p>
                      </div>

                      {/* Current Domains Preview */}
                      {ssoDomainsInput && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Configured Domains
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {ssoDomainsInput.split(',').map((domain, index) => {
                              const trimmedDomain = domain.trim()
                              if (!trimmedDomain) return null
                              return (
                                <Badge key={index} className="bg-blue-100 text-blue-800">
                                  {trimmedDomain}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Warning for enforce SSO */}
                      {ssoSettings.enforce_sso && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                              <p className="font-medium">SSO Enforcement Active</p>
                              <p className="mt-1">
                                Users with email addresses from the configured domains will only be able to sign in using SSO. 
                                Make sure your SSO configuration is working correctly before enabling this.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 border-red-200"
                          onClick={handleDisableSSO}
                          disabled={isDisablingSSO}
                        >
                          {isDisablingSSO ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <X className="mr-2 h-4 w-4" />
                          )}
                          Disable SSO
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => {
                            setShowSSOSettingsModal(false)
                            setSSOSettingsTab('settings')
                          }}>
                            Cancel
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleUpdateSSOSettings}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="mr-2 h-4 w-4" />
                            )}
                            Save Settings
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Audit Logs Tab */}
              {ssoSettingsTab === 'audit' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Configuration Change History</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditLogsPage)}
                      disabled={isLoadingAuditLogs}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingAuditLogs ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>

                  {isLoadingAuditLogs ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No audit logs found</p>
                      <p className="text-xs mt-1">SSO configuration changes will appear here</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {auditLogs.map((log) => {
                          const actionInfo = formatAuditAction(log.action)
                          return (
                            <div
                              key={log.id}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={actionInfo.color}>
                                      {actionInfo.label}
                                    </Badge>
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatAuditDate(log.created_at || log.timestamp || '')}
                                    </span>
                                  </div>
                                  {(log.user_name || log.user_email) && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      by {log.user_name || log.user_email}
                                    </p>
                                  )}
                                  {log.details && Object.keys(log.details).length > 0 && (
                                    <div className="mt-2 text-xs text-gray-500 bg-gray-100 rounded p-2 font-mono">
                                      {Object.entries(log.details).map(([key, value]) => (
                                        <div key={key}>
                                          <span className="text-gray-600">{key}:</span>{' '}
                                          <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {log.ip_address && (
                                  <span className="text-xs text-gray-400 flex-shrink-0">
                                    {log.ip_address}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Pagination */}
                      {auditLogsTotal > AUDIT_LOGS_LIMIT && (
                        <div className="flex items-center justify-between pt-4 border-t">
                          <p className="text-sm text-gray-500">
                            Showing {auditLogsPage * AUDIT_LOGS_LIMIT + 1} - {Math.min((auditLogsPage + 1) * AUDIT_LOGS_LIMIT, auditLogsTotal)} of {auditLogsTotal}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchAuditLogs(auditLogsPage - 1)}
                              disabled={auditLogsPage === 0 || isLoadingAuditLogs}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchAuditLogs(auditLogsPage + 1)}
                              disabled={(auditLogsPage + 1) * AUDIT_LOGS_LIMIT >= auditLogsTotal || isLoadingAuditLogs}
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => {
                      setShowSSOSettingsModal(false)
                      setSSOSettingsTab('settings')
                    }}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

