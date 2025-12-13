import { Plus, TrendingUp, MessageSquare, AlertCircle, Search } from 'lucide-react'

export default function SocialListeningPage() {
  const mockKeywords = [
    { id: 1, keyword: 'our brand', mentions: 245, sentiment: 'positive', alerts: 3 },
    { id: 2, keyword: 'competitor name', mentions: 189, sentiment: 'neutral', alerts: 1 },
    { id: 3, keyword: 'industry trend', mentions: 156, sentiment: 'positive', alerts: 0 },
  ]

  const mockMentions = [
    { id: 1, platform: 'Twitter', author: '@user123', content: 'Just tried the new feature, absolutely love it!', sentiment: 'positive', time: '2h ago' },
    { id: 2, platform: 'Instagram', author: 'sarah_m', content: 'Great customer service experience', sentiment: 'positive', time: '4h ago' },
    { id: 3, platform: 'Facebook', author: 'John D.', content: 'Having some issues with the latest update', sentiment: 'negative', time: '6h ago' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Social Listening</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Keyword
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-600">Total Mentions</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">+23%</p>
              <p className="text-sm text-gray-600">Growth This Week</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">78%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Positive</p>
              <p className="text-sm text-gray-600">Sentiment</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keywords */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Tracked Keywords</h2>
          </div>
          <div className="divide-y">
            {mockKeywords.map((keyword) => (
              <div key={keyword.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{keyword.keyword}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{keyword.mentions} mentions</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      keyword.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      keyword.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {keyword.sentiment}
                    </span>
                    {keyword.alerts > 0 && (
                      <span className="text-red-600">{keyword.alerts} alerts</span>
                    )}
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mentions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Mentions</h2>
          </div>
          <div className="divide-y">
            {mockMentions.map((mention) => (
              <div key={mention.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary-600">{mention.platform}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{mention.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{mention.time}</span>
                </div>
                <p className="text-gray-900 mb-2">{mention.content}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  mention.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  mention.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {mention.sentiment}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}