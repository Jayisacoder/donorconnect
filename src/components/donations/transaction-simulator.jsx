"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'

export function TransactionSimulator() {
  const [donors, setDonors] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState(null)

  const [formData, setFormData] = useState({
    donorId: '',
    campaignId: '',
    amount: '50',
    type: 'ONE_TIME'
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [donorsRes, campaignsRes] = await Promise.all([
          fetch('/api/donors?limit=100'),
          fetch('/api/campaigns')
        ])
        const donorsData = await donorsRes.json()
        const campaignsData = await campaignsRes.json()
        
        setDonors(donorsData.donors || [])
        setCampaigns(campaignsData.campaigns || [])
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSimulate = async (e) => {
    e.preventDefault()
    if (!formData.donorId) {
      toast.error('Please select a donor')
      return
    }

    setSimulating(true)
    setResult(null)

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: formData.donorId,
          campaignId: formData.campaignId || undefined,
          amount: parseFloat(formData.amount),
          type: formData.type,
          date: new Date().toISOString(),
          status: 'COMPLETED'
        })
      })

      if (!res.ok) throw new Error('Simulation failed')
      
      const data = await res.json()
      setResult(data.donation)
      toast.success('Transaction simulated successfully!')
    } catch (error) {
      toast.error('Failed to simulate transaction')
    } finally {
      setSimulating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Transaction Simulator
          </CardTitle>
          <CardDescription>
            Quickly generate a donation to see how it affects the dashboard and donor profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="donor">Select Donor</Label>
                <Select 
                  value={formData.donorId} 
                  onValueChange={(val) => setFormData({ ...formData, donorId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a donor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {donors.map(donor => (
                      <SelectItem key={donor.id} value={donor.id}>
                        {donor.firstName} {donor.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign (Optional)</Label>
                <Select 
                  value={formData.campaignId} 
                  onValueChange={(val) => setFormData({ ...formData, campaignId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a campaign..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount"
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Donation Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TIME">One-time</SelectItem>
                    <SelectItem value="RECURRING">Recurring</SelectItem>
                    <SelectItem value="PLEDGE">Pledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={simulating}>
              {simulating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Simulate Transaction
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            A donation of ${result.amount} from {donors.find(d => d.id === result.donorId)?.firstName} has been recorded.
            The donor's total giving and last gift date have been updated.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
