'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Home, Calendar, BarChart3, Users, MessageSquare, Settings,
  Inbox, Image, Workflow, Bot, TrendingUp, Repeat, FileText,
  CreditCard, Zap, BookOpen, Target, ChevronDown, ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Posts', href: '/posts', icon: MessageSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { 
    name: 'Analytics', 
    icon: BarChart3,
    children: [
      { name: 'Overview', href: '/analytics' },
      { name: 'Engagement', href: '/analytics/engagement' },
      { name: 'Audience', href: '/analytics/audience' },
      { name: 'Competitors', href: '/analytics/competitors' },
    ]
  },
  { 
    name: 'Inbox', 
    icon: Inbox,
    children: [
      { name: 'All Messages', href: '/inbox' },
      { name: 'Messages', href: '/inbox/messages' },
      { name: 'Mentions', href: '/inbox/mentions' },
      { name: 'Reviews', href: '/inbox/reviews' },
    ]
  },
  { 
    name: 'Media', 
    icon: Image,
    children: [
      { name: 'Library', href: '/media' },
      { name: 'Folders', href: '/media/folders' },
      { name: 'Tags', href: '/media/tags' },
      { name: 'Bulk Upload', href: '/media/bulk' },
    ]
  },
  { 
    name: 'AI Tools', 
    icon: Bot,
    children: [
      { name: 'All Tools', href: '/ai' },
      { name: 'Captions', href: '/ai/captions' },
      { name: 'Hashtags', href: '/ai/hashtags' },
      { name: 'Images', href: '/ai/images' },
    ]
  },
  { name: 'Competitors', href: '/competitors', icon: Target },
  { name: 'Social Listening', href: '/social-listening', icon: TrendingUp },
  { 
    name: 'Content', 
    icon: BookOpen,
    children: [
      { name: 'Library', href: '/content' },
      { name: 'Templates', href: '/content/templates' },
      { name: 'Calendar', href: '/content/calendar' },
    ]
  },
  { name: 'Drafts', href: '/drafts', icon: FileText },
  { name: 'Recurring Posts', href: '/recurring-posts', icon: Repeat },
  { 
    name: 'Workflows', 
    icon: Workflow,
    children: [
      { name: 'All Workflows', href: '/workflows' },
      { name: 'Create', href: '/workflows/create' },
      { name: 'Templates', href: '/workflows/templates' },
    ]
  },
  { 
    name: 'Team', 
    icon: Users,
    children: [
      { name: 'Members', href: '/team' },
      { name: 'Invitations', href: '/team/invitations' },
      { name: 'Roles', href: '/team/roles' },
    ]
  },
  { 
    name: 'Reports', 
    icon: BarChart3,
    children: [
      { name: 'All Reports', href: '/reports' },
      { name: 'Scheduled', href: '/reports/scheduled' },
      { name: 'Custom', href: '/reports/custom' },
    ]
  },
  { name: 'Integrations', href: '/integrations', icon: Zap },
  { name: 'Accounts', href: '/accounts', icon: Users },
]

export default function Navigation() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="w-64 bg-white shadow-sm border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">You Fit Run Am</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {expandedItems.includes(item.name) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 text-sm rounded-lg ${
                          isActive(child.href)
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
            isActive('/settings')
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Link 
          href="/billing" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
            isActive('/billing')
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Billing
        </Link>
      </div>
    </div>
  )
}