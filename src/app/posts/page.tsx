import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function PostsPage() {
  const mockPosts = [
    { id: 1, content: 'Exciting news! Our new feature is live 🎉', platforms: ['Twitter', 'LinkedIn'], status: 'Published', date: '2024-01-15', engagement: '245 likes' },
    { id: 2, content: 'Behind the scenes: How we built our latest update', platforms: ['Instagram', 'Facebook'], status: 'Scheduled', date: '2024-01-16', engagement: 'Scheduled for 9:00 AM' },
    { id: 3, content: 'Tips for better social media engagement', platforms: ['Twitter'], status: 'Draft', date: '2024-01-14', engagement: 'Draft' },
    { id: 4, content: 'Customer success story: How Company X increased ROI by 300%', platforms: ['LinkedIn'], status: 'Published', date: '2024-01-13', engagement: '89 likes' },
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
              <Link href="/posts" className="text-primary-600 font-medium">Posts</Link>
              <Link href="/calendar" className="text-gray-500 hover:text-gray-700">Calendar</Link>
              <Link href="/analytics" className="text-gray-500 hover:text-gray-700">Analytics</Link>
              <Link href="/accounts" className="text-gray-500 hover:text-gray-700">Accounts</Link>
            </nav>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
              <Plus className="w-4 h-4" />
              Create Post
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="divide-y">
            {mockPosts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Platforms: {post.platforms.join(', ')}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full ${
                        post.status === 'Published' ? 'bg-green-100 text-green-800' :
                        post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{post.engagement}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}