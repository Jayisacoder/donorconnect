"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useCampaigns } from '@/hooks/use-campaigns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CampaignStatusBadge } from '@/components/campaigns/campaign-status-badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// Campaigns list page
export default function CampaignsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { campaigns, loading } = useCampaigns(1, 50, {
    search,
    status: status || undefined,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-400 mt-2">Track fundraising initiatives and progress</p>
        </div>
        <Button disabled variant="outline" title="Campaign creation coming soon" className="shadow-sm">
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          placeholder="Search campaigns"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 hover:border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none cursor-pointer" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading && <div>Loading campaigns...</div>}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns?.length ? (
            campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="block group">
                <Card className="h-full transition-all duration-200 hover:shadow-xl hover:scale-105 hover:border-primary/30 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{campaign.name}</CardTitle>
                      <CampaignStatusBadge status={campaign.status} />
                    </div>
                    <p className="text-sm text-gray-400">{campaign.description || 'No description'}</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-300">
                    <p>
                      <span className="font-medium text-white">Goal:</span> {campaign.goalAmount ? formatCurrency(campaign.goalAmount) : '—'}
                    </p>
                    <p>
                      <span className="font-medium text-white">Start:</span> {campaign.startDate ? formatDate(campaign.startDate) : '—'}
                    </p>
                    <p>
                      <span className="font-medium text-white">End:</span> {campaign.endDate ? formatDate(campaign.endDate) : '—'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-400">No campaigns found.</p>
          )}
        </div>
      )}
    </div>
  )
}