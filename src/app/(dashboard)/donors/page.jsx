"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DonorStatusBadge } from '@/components/donors/donor-status-badge'
import { RetentionRiskBadge } from '@/components/donors/retention-risk-badge'
import { useDonors } from '@/hooks/use-donors'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function DonorsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [risk, setRisk] = useState('')
  const [sortBy, setSortBy] = useState('firstName')
  const [sortOrder, setSortOrder] = useState('asc')

  const { donors, pagination, loading, error } = useDonors(page, 10, {
    search,
    status: status || undefined,
    retentionRisk: risk || undefined,
    sortBy,
    sortOrder,
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedDonors = useMemo(() => donors || [], [donors])

  const totalPages = Math.max(1, Math.ceil((pagination?.total || 0) / (pagination?.limit || 10)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl border border-primary/20">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Donors</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your donor relationships and track engagement
          </p>
        </div>
        <Link href="/donors/new">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Donor
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
        />
        <select
          className="w-full rounded border-2 px-3 py-2 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={status}
          onChange={(e) => {
            setPage(1)
            setStatus(e.target.value)
          }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="LAPSED">Lapsed</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DO_NOT_CONTACT">Do Not Contact</option>
        </select>
        <select
          className="w-full rounded border-2 px-3 py-2 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={risk}
          onChange={(e) => {
            setPage(1)
            setRisk(e.target.value)
          }}
        >
          <option value="">All Risks</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
        <select
          className="w-full rounded border-2 px-3 py-2 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split(':')
            setSortBy(field)
            setSortOrder(dir)
          }}
        >
          <option value="firstName:asc">Name (A→Z)</option>
          <option value="firstName:desc">Name (Z→A)</option>
          <option value="email:asc">Email (A→Z)</option>
          <option value="email:desc">Email (Z→A)</option>
          <option value="totalAmount:desc">Total Raised (High→Low)</option>
          <option value="totalAmount:asc">Total Raised (Low→High)</option>
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
        </select>
      </div>

      <div className="rounded-xl border shadow-md bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="cursor-pointer" onClick={() => handleSort('firstName')}>
                Name
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                Email
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('totalAmount')}>
                Lifetime Value
              </TableHead>
              <TableHead>Last Gift</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Loading donors...
                  </div>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-destructive">
                    <p className="font-medium">Unable to load donors</p>
                    <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && sortedDonors.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No donors found.</TableCell>
              </TableRow>
            )}
            {!loading && !error &&
              sortedDonors.map((donor) => (
                <TableRow key={donor.id} className="hover:bg-primary/5 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <TableCell className="font-medium group-hover:text-primary transition-colors">
                    {donor.firstName} {donor.lastName}
                  </TableCell>
                  <TableCell>{donor.email}</TableCell>
                  <TableCell>
                    <DonorStatusBadge status={donor.status} />
                  </TableCell>
                  <TableCell>
                    <RetentionRiskBadge risk={donor.retentionRisk} />
                  </TableCell>
                  <TableCell>{formatCurrency(donor.totalAmount || 0)}</TableCell>
                  <TableCell>{donor.lastGiftDate ? formatDate(donor.lastGiftDate) : '—'}</TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap">
                    <Link href={`/donors/${donor.id}`} className="text-sm text-primary font-medium hover:underline hover:text-primary/80 hover:scale-110 inline-block transition-all">
                      View
                    </Link>
                    <Link href={`/donors/${donor.id}/edit`} className="text-sm text-primary font-medium hover:underline hover:text-primary/80 hover:scale-110 inline-block transition-all">
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
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