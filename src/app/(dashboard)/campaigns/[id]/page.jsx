"use client"

import { use } from 'react'
import { CampaignStatusBadge } from '@/components/campaigns/campaign-status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaign } from '@/hooks/use-campaigns'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Campaign detail page
export default function CampaignDetailPage({ params }) {
  const { id } = use(params)
  const { campaign, loading, error } = useCampaign(id)

  if (loading) return <div>Loading campaign...</div>
  if (error || !campaign) return <div>Unable to load campaign.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <CampaignStatusBadge status={campaign.status} />
            {campaign.goalAmount ? (
              <span className="text-sm text-gray-700">Goal: {formatCurrency(campaign.goalAmount)}</span>
            ) : null}
          </div>
        </div>
        <Link href="/campaigns">
          <Button variant="outline">Back to campaigns</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Description:</span> {campaign.description || 'No description provided.'}</p>
          <p><span className="font-medium">Start:</span> {campaign.startDate ? formatDate(campaign.startDate) : '—'}</p>
          <p><span className="font-medium">End:</span> {campaign.endDate ? formatDate(campaign.endDate) : '—'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          This page can be extended to list campaign donations once available.
        </CardContent>
      </Card>
    </div>
  )
}
