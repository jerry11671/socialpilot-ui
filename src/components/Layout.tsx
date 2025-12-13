import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, Calendar, BarChart3, Users, MessageSquare, Plus, Settings,
  Inbox, Image, Workflow, Bot, TrendingUp, Repeat, FileText,
  CreditCard, Zap, BookOpen, Target
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Posts', href: '/posts', icon: MessageSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Media', href: '/media', icon: Image },
  { name: 'AI Tools', href: '/ai', icon: Bot },
  { name: 'Competitors', href: '/competitors', icon: Target },
  { name: 'Social Listening', href: '/social-listening', icon: TrendingUp },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Accounts', href: '/accounts', icon: Zap },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">SocialPilot</h1>
        </div>
        <nav className="px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex justify-between items-center">
            <div></div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
              <Plus className="w-4 h-4" />
              Create Post
            </button>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}