'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Loader2 } from 'lucide-react'

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competitor Analysis</h1>
          <p className="text-gray-500 mt-1">Track and analyze your competitors' performance</p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => alert('Feature coming soon')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Competitor
        </Button>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-4">Competitor Analysis feature is being updated</p>
          <p className="text-sm text-gray-400">Please check back soon</p>
        </CardContent>
      </Card>
    </div>
  )
}