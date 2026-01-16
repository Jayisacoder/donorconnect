"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Heart, Lock } from 'lucide-react'

/**
 * Public Donation Page
 * Where donors make contributions with simulated card payment
 */
export default function DonatePage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  // Form state
  const [formData, setFormData] = useState({
    // Donor info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Donation details
    campaignId: '',
    amount: '',
    donationType: 'ONE_TIME',
    // Card info (simulated)
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })

  // Load active campaigns
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await fetch('/api/campaigns/public')
        if (res.ok) {
          const data = await res.json()
          setCampaigns(data.campaigns || [])
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCampaigns()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setFormData(prev => ({ ...prev, cardNumber: formatted }))
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Donor info
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required'
    if (!formData.email.trim()) newErrors.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    
    // Donation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount'
    }
    
    // Card validation
    const cardDigits = formData.cardNumber.replace(/\s/g, '')
    if (cardDigits.length !== 16) newErrors.cardNumber = 'Card number must be 16 digits'
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name required'
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = 'Expiry date required'
    }
    if (formData.cvv.length !== 3 && formData.cvv.length !== 4) {
      newErrors.cvv = 'CVV must be 3 or 4 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setProcessing(true)
    
    try {
      const res = await fetch('/api/donations/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          campaignId: formData.campaignId || null,
          amount: parseFloat(formData.amount),
          type: formData.donationType,
          // Card info for simulation (not stored)
          cardLast4: formData.cardNumber.replace(/\s/g, '').slice(-4),
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        // Redirect to success page
        router.push(`/donate/success?id=${data.donationId}`)
      } else {
        setErrors({ submit: data.error || 'Failed to process donation' })
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setProcessing(false)
    }
  }

  const selectedCampaign = campaigns.find(c => c.id === formData.campaignId)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
        <p className="text-xl text-gray-600">
          Your generosity makes our mission possible
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Campaign (Optional)</CardTitle>
                <CardDescription>Choose a specific campaign to support</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-500">Loading campaigns...</p>
                ) : campaigns.length > 0 ? (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="campaignId"
                        value=""
                        checked={!formData.campaignId}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">General Fund</p>
                        <p className="text-sm text-gray-600">Support where it's needed most</p>
                      </div>
                    </label>
                    {campaigns.map(campaign => (
                      <label 
                        key={campaign.id}
                        className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="campaignId"
                          value={campaign.id}
                          checked={formData.campaignId === campaign.id}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{campaign.name}</p>
                          <p className="text-sm text-gray-600">{campaign.description}</p>
                          {campaign.goal && (
                            <div className="mt-2">
                              <Badge variant="outline">
                                ${campaign.raised?.toLocaleString() || 0} / ${campaign.goal.toLocaleString()} raised
                              </Badge>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active campaigns at the moment</p>
                )}
              </CardContent>
            </Card>

            {/* Donation Amount */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[25, 50, 100, 250].map(amount => (
                    <Button
                      key={amount}
                      type="button"
                      variant={formData.amount === amount.toString() ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Amount</label>
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Frequency</label>
                  <select
                    name="donationType"
                    value={formData.donationType}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="ONE_TIME">One-time</option>
                    <option value="RECURRING">Monthly recurring</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Donor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure payment simulation (demo only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Demo Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    🧪 Demo Mode: Payment Simulation Only
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    This form simulates card processing for demonstration purposes. 
                    No real charges will be made. Use any test card number like 4111 1111 1111 1111.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <Input
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 1111 1111 1111 (test card)"
                    maxLength="19"
                    className={errors.cardNumber ? 'border-red-500' : ''}
                  />
                  {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <Input
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.cardName ? 'border-red-500' : ''}
                  />
                  {errors.cardName && <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Month</label>
                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      className={`w-full rounded border px-3 py-2 ${errors.expiry ? 'border-red-500' : ''}`}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m.toString().padStart(2, '0')}>
                          {m.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      className={`w-full rounded border px-3 py-2 ${errors.expiry ? 'border-red-500' : ''}`}
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => 2025 + i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <Input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setFormData(prev => ({ ...prev, cvv: value }))
                      }}
                      placeholder="123"
                      maxLength="4"
                      className={errors.cvv ? 'border-red-500' : ''}
                    />
                  </div>
                </div>
                {errors.expiry && <p className="text-sm text-red-500">{errors.expiry}</p>}
                {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
              </CardContent>
            </Card>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {errors.submit}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={processing}>
              {processing ? 'Processing...' : `Donate $${formData.amount || '0'}`}
            </Button>
          </div>

          {/* Summary Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCampaign && (
                  <div>
                    <p className="text-sm text-gray-600">Campaign</p>
                    <p className="font-semibold">{selectedCampaign.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold">
                    ${formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Frequency</p>
                  <p className="font-semibold">
                    {formData.donationType === 'ONE_TIME' ? 'One-time' : 'Monthly recurring'}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Tax receipts will be sent to your email address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
