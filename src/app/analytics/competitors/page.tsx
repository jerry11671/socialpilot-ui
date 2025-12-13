export default function CompetitorAnalyticsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Competitor Analytics</h1>
        <p className="text-gray-600">Compare with competitors</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitor Analytics</h3>
          <p className="text-gray-600 mb-4">Compare with competitors</p>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}