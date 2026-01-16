"use client"

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SegmentBuilderForm } from '@/components/segments/segment-builder-form'
import { RefreshCw, Users } from 'lucide-react'

// Segment detail page
export default function SegmentDetailPage({ params }) {
  const { id: segmentId } = use(params)
  const [segment, setSegment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recalculating, setRecalculating] = useState(false)

  const loadSegment = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/segments/${segmentId}`)
      if (!res.ok) throw new Error('Failed to load segment')
      const data = await res.json()
      setSegment(data.segment || null)
    } catch (err) {
      setError('Unable to load segment')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSegment()
  }, [segmentId])

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      const res = await fetch(`/api/segments/${segmentId}/recalculate`, {
        method: 'POST',
      })
      if (res.ok) {
        await loadSegment()
      } else {
        alert('Failed to recalculate segment')
      }
    } catch (error) {
      console.error('Error recalculating:', error)
      alert('Failed to recalculate segment')
    } finally {
      setRecalculating(false)
    }
  }

  if (loading) return <div>Loading segment...</div>
  if (error || !segment) return <div>{error || 'Segment not found.'}</div>

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{segment.name}</h1>
          <p className="text-gray-600 mt-1">{segment.description || 'No description provided.'}</p>
          {segment.lastCalculated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(segment.lastCalculated).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRecalculate} disabled={recalculating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${recalculating ? 'animate-spin' : ''}`} />
            {recalculating ? 'Recalculating...' : 'Recalculate'}
          </Button>
          <Link href="/segments">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {/* Member Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Segment Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{segment.memberCount || 0}</span>
            <span className="text-gray-600">donor{segment.memberCount !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Donors are automatically added based on the segment rules below.
          </p>
        </CardContent>
      </Card>

      {/* Edit Segment */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Segment Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <SegmentBuilderForm
            segment={segment}
            onSubmit={async (data) => {
              const res = await fetch(`/api/segments/${segmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })
              if (res.ok) {
                await loadSegment()
              } else {
                alert('Failed to update segment')
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}