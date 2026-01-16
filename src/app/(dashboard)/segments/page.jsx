"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useSegments } from '@/hooks/use-segments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Segments page
export default function SegmentsPage() {
  const [search, setSearch] = useState('')
  const { segments, loading } = useSegments(1, 50, { search })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Segments</h1>
          <p className="text-gray-600 mt-2">Group donors by behavior for targeting and workflows.</p>
        </div>
        <Link href="/segments/new">
          <Button>+ New Segment</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input placeholder="Search segments" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && <div>Loading segments...</div>}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {segments?.length ? (
            segments.map((segment) => (
              <Link key={segment.id} href={`/segments/${segment.id}`} className="block group">
                <Card className="h-full transition-all duration-200 hover:shadow-xl hover:scale-105 hover:border-primary/30 cursor-pointer">
                  <CardHeader>
                    <CardTitle>{segment.name}</CardTitle>
                    <p className="text-sm text-gray-600">{segment.description || 'No description'}</p>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">
                    Members: {segment._count?.members ?? segment.memberCount ?? '—'}
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-600">No segments found.</p>
          )}
        </div>
      )}
    </div>
  )
}