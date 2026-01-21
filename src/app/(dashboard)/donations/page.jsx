"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap } from 'lucide-react'
import { DonationList } from '@/components/donations/donation-list'
import { useDonations } from '@/hooks/use-donations'

// Donations list page
export default function DonationsPage() {
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const { donations, pagination, loading } = useDonations(page, 10, {
    type: type || undefined,
  })

  const totalPages = Math.max(1, Math.ceil((pagination?.total || 0) / (pagination?.limit || 10)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-gray-400 mt-2">Track all recorded gifts</p>
        </div>
        <div className="flex gap-2">
          <Link href="/donations/new">
            <Button>Record Donation</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <select className="w-full rounded border-2 px-3 py-2 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="ONE_TIME">One-time</option>
          <option value="RECURRING">Recurring</option>
          <option value="PLEDGE">Pledge</option>
          <option value="IN_KIND">In-kind</option>
        </select>
        <Input disabled placeholder="More filters coming soon" />
      </div>

      <DonationList donations={donations} isLoading={loading} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}