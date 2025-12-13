import { Plus, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AccountsPage() {
  const mockAccounts = [
    { id: 1, platform: 'Instagram', username: '@mycompany', status: 'connected', followers: '8.5K', lastSync: '2 hours ago' },
    { id: 2, platform: 'Twitter', username: '@mycompany', status: 'connected', followers: '12.1K', lastSync: '1 hour ago' },
    { id: 3, platform: 'LinkedIn', username: 'My Company', status: 'connected', followers: '3.2K', lastSync: '30 minutes ago' },
    { id: 4, platform: 'Facebook', username: 'My Company Page', status: 'error', followers: '5.8K', lastSync: 'Failed' },
    { id: 5, platform: 'TikTok', username: 'Not Connected', status: 'disconnected', followers: '-', lastSync: '-' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">SocialPilot</Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              <Link href="/posts" className="text-gray-500 hover:text-gray-700">Posts</Link>
              <Link href="/calendar" className="text-gray-500 hover:text-gray-700">Calendar</Link>
              <Link href="/analytics" className="text-gray-500 hover:text-gray-700">Analytics</Link>
              <Link href="/accounts" className="text-primary-600 font-medium">Accounts</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Social Accounts</h1>
            <p className="text-gray-600">Manage your connected social media accounts</p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
            <Plus className="w-4 h-4" />
            Connect Account
          </button>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAccounts.map((account) => (
            <div key={account.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {account.platform.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.platform}</h3>
                    <p className="text-sm text-gray-500">{account.username}</p>
                  </div>
                </div>
                {account.status === 'connected' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {account.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Followers:</span>
                  <span className="font-medium">{account.followers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Sync:</span>
                  <span className="font-medium">{account.lastSync}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {account.status === 'connected' ? (
                  <>
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      Settings
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                      Sync Now
                    </button>
                  </>
                ) : account.status === 'error' ? (
                  <button className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reconnect
                  </button>
                ) : (
                  <button className="w-full px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Available Platforms */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['YouTube', 'Pinterest', 'Snapchat', 'Reddit', 'Discord', 'Telegram'].map((platform) => (
              <button
                key={platform}
                className="p-4 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-center"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">
                    {platform.charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{platform}</p>
                <p className="text-xs text-gray-500">Coming Soon</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}