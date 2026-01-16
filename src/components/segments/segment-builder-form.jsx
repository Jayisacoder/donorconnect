/**
 * Segment Builder Form - User-friendly segment creation without JSON
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, AlertCircle } from 'lucide-react'

const RETENTION_RISK_OPTIONS = [
  { value: 'UNKNOWN', label: 'Unknown', color: 'bg-gray-100 text-gray-800' },
  { value: 'LOW', label: 'Low Risk', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', label: 'High Risk', color: 'bg-orange-100 text-orange-800' },
  { value: 'CRITICAL', label: 'Critical Risk', color: 'bg-red-100 text-red-800' },
]

const DONOR_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'LAPSED', label: 'Lapsed', color: 'bg-orange-100 text-orange-800' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-800' },
  { value: 'PROSPECT', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
]

export function SegmentBuilderForm({ segment, onSubmit, submitting }) {
  const [name, setName] = useState(segment?.name || '')
  const [description, setDescription] = useState(segment?.description || '')
  
  // Rule state
  const [selectedRetentionRisks, setSelectedRetentionRisks] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [minTotalGifts, setMinTotalGifts] = useState('')
  const [maxTotalGifts, setMaxTotalGifts] = useState('')
  const [minTotalAmount, setMinTotalAmount] = useState('')
  const [maxTotalAmount, setMaxTotalAmount] = useState('')
  const [daysSinceLastGift, setDaysSinceLastGift] = useState('')
  const [hasEmail, setHasEmail] = useState('any')
  
  // Preview
  const [matchingDonors, setMatchingDonors] = useState([])
  const [previewLoading, setPreviewLoading] = useState(false)

  // Parse existing segment rules
  useEffect(() => {
    if (segment?.rules) {
      const rules = segment.rules
      if (rules.retentionRisk) setSelectedRetentionRisks(rules.retentionRisk)
      if (rules.status) setSelectedStatuses(rules.status)
      if (rules.totalGiftsRange?.min) setMinTotalGifts(rules.totalGiftsRange.min.toString())
      if (rules.totalGiftsRange?.max) setMaxTotalGifts(rules.totalGiftsRange.max.toString())
      if (rules.totalAmountRange?.min) setMinTotalAmount(rules.totalAmountRange.min.toString())
      if (rules.totalAmountRange?.max) setMaxTotalAmount(rules.totalAmountRange.max.toString())
      if (rules.daysSinceLastGift) setDaysSinceLastGift(rules.daysSinceLastGift.toString())
      if (rules.hasEmail !== undefined) setHasEmail(rules.hasEmail ? 'yes' : 'no')
    }
  }, [segment])

  const buildRules = () => {
    const rules = {}
    
    if (selectedRetentionRisks.length > 0) {
      rules.retentionRisk = selectedRetentionRisks
    }
    
    if (selectedStatuses.length > 0) {
      rules.status = selectedStatuses
    }
    
    if (minTotalGifts || maxTotalGifts) {
      rules.totalGiftsRange = {}
      if (minTotalGifts) rules.totalGiftsRange.min = parseInt(minTotalGifts)
      if (maxTotalGifts) rules.totalGiftsRange.max = parseInt(maxTotalGifts)
    }
    
    if (minTotalAmount || maxTotalAmount) {
      rules.totalAmountRange = {}
      if (minTotalAmount) rules.totalAmountRange.min = parseFloat(minTotalAmount)
      if (maxTotalAmount) rules.totalAmountRange.max = parseFloat(maxTotalAmount)
    }
    
    if (daysSinceLastGift) {
      rules.daysSinceLastGift = parseInt(daysSinceLastGift)
    }
    
    if (hasEmail !== 'any') {
      rules.hasEmail = hasEmail === 'yes'
    }
    
    return rules
  }

  const loadPreview = async () => {
    setPreviewLoading(true)
    try {
      const rules = buildRules()
      const res = await fetch('/api/segments/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setMatchingDonors(data.donors || [])
      }
    } catch (error) {
      console.error('Error loading preview:', error)
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a segment name')
      return
    }
    
    const rules = buildRules()
    onSubmit({
      name,
      description: description || null,
      rules,
    })
  }

  const toggleRetentionRisk = (value) => {
    setSelectedRetentionRisks(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const toggleStatus = (value) => {
    setSelectedStatuses(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Segment Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., High-Value Donors, Lapsed Major Givers"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what this segment is for..."
            rows={2}
          />
        </div>
      </div>

      <hr />

      {/* Rules Builder */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Who should be included?</h3>
        <p className="text-sm text-gray-600">Select the criteria below. Donors matching ALL selected criteria will be added automatically.</p>

        {/* Retention Risk */}
        <div>
          <label className="block text-sm font-medium mb-3">Retention Risk Level</label>
          <div className="flex flex-wrap gap-2">
            {RETENTION_RISK_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleRetentionRisk(option.value)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                  selectedRetentionRisks.includes(option.value)
                    ? `${option.color} border-gray-900 shadow-md scale-105`
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedRetentionRisks.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              Including: {selectedRetentionRisks.join(', ')}
            </p>
          )}
        </div>

        {/* Donor Status */}
        <div>
          <label className="block text-sm font-medium mb-3">Donor Status</label>
          <div className="flex flex-wrap gap-2">
            {DONOR_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleStatus(option.value)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                  selectedStatuses.includes(option.value)
                    ? `${option.color} border-gray-900 shadow-md scale-105`
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedStatuses.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              Including: {selectedStatuses.join(', ')}
            </p>
          )}
        </div>

        {/* Total Gifts Range */}
        <div>
          <label className="block text-sm font-medium mb-3">Number of Gifts</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Minimum</label>
              <Input
                type="number"
                value={minTotalGifts}
                onChange={(e) => setMinTotalGifts(e.target.value)}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Maximum</label>
              <Input
                type="number"
                value={maxTotalGifts}
                onChange={(e) => setMaxTotalGifts(e.target.value)}
                placeholder="e.g., 50"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Total Amount Range */}
        <div>
          <label className="block text-sm font-medium mb-3">Total Lifetime Giving</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Minimum ($)</label>
              <Input
                type="number"
                value={minTotalAmount}
                onChange={(e) => setMinTotalAmount(e.target.value)}
                placeholder="e.g., 1000"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Maximum ($)</label>
              <Input
                type="number"
                value={maxTotalAmount}
                onChange={(e) => setMaxTotalAmount(e.target.value)}
                placeholder="e.g., 10000"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Days Since Last Gift */}
        <div>
          <label className="block text-sm font-medium mb-3">Last Gift Was...</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">More than</span>
            <Input
              type="number"
              value={daysSinceLastGift}
              onChange={(e) => setDaysSinceLastGift(e.target.value)}
              placeholder="e.g., 365"
              min="0"
              className="w-32"
            />
            <span className="text-sm text-gray-600">days ago</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave empty to include all donors regardless of last gift date</p>
        </div>

        {/* Has Email */}
        <div>
          <label className="block text-sm font-medium mb-3">Email Address</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHasEmail('any')}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                hasEmail === 'any'
                  ? 'bg-blue-100 text-blue-800 border-gray-900 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Any
            </button>
            <button
              type="button"
              onClick={() => setHasEmail('yes')}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                hasEmail === 'yes'
                  ? 'bg-green-100 text-green-800 border-gray-900 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Has Email
            </button>
            <button
              type="button"
              onClick={() => setHasEmail('no')}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                hasEmail === 'no'
                  ? 'bg-gray-100 text-gray-800 border-gray-900 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              No Email
            </button>
          </div>
        </div>
      </div>

      <hr />

      {/* Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Preview Matching Donors</h3>
          <Button type="button" variant="outline" onClick={loadPreview} disabled={previewLoading}>
            {previewLoading ? 'Loading...' : 'Refresh Preview'}
          </Button>
        </div>
        
        <Card className="p-4">
          {matchingDonors.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                {matchingDonors.length} donor{matchingDonors.length !== 1 ? 's' : ''} match this criteria
              </p>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {matchingDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium">{donor.firstName} {donor.lastName}</p>
                      <p className="text-xs text-gray-600">
                        {donor.totalGifts} gifts · ${donor.totalAmount?.toFixed(2)} total
                        {donor.email && ` · ${donor.email}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{donor.status}</Badge>
                      <Badge variant="outline">{donor.retentionRisk}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : previewLoading ? (
            <p className="text-sm text-gray-600">Loading preview...</p>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Click "Refresh Preview" to see matching donors</p>
            </div>
          )}
        </Card>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : segment ? 'Update Segment' : 'Create Segment'}
        </Button>
      </div>
    </form>
  )
}
