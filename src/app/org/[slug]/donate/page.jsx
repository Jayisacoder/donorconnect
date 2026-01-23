"use client"

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Heart, Lock, ArrowLeft, CheckCircle } from 'lucide-react'

/**
 * Organization-specific Donation Page
 */
export default function OrgDonatePage({ params }) {
  const { slug } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCampaignId = searchParams.get('campaign')

  const [organization, setOrganization] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    campaignId: preselectedCampaignId || '',
    amount: '',
    donationType: 'ONE_TIME',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })

  // Load organization and campaigns
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/organizations/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setOrganization(data.organization)
          setCampaigns(data.organization.campaigns || [])
          // Set preselected campaign if provided
          if (preselectedCampaignId) {
            setFormData(prev => ({ ...prev, campaignId: preselectedCampaignId }))
          }
        } else {
          router.push('/organizations')
        }
      } catch (err) {
        console.error('Failed to load organization:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug, preselectedCampaignId, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required'
    if (!formData.email.trim()) newErrors.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount'
    }
    
    const cardDigits = formData.cardNumber.replace(/\s/g, '')
    if (cardDigits.length !== 16) newErrors.cardNumber = 'Card number must be 16 digits'
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name required'
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = 'Expiry date required'
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setProcessing(true)
    
    try {
      const res = await fetch('/api/donations/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: organization.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          campaignId: formData.campaignId || null,
          amount: parseFloat(formData.amount),
          type: formData.donationType,
        }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setErrors({ submit: data.error || 'Donation failed. Please try again.' })
      }
    } catch (err) {
      console.error('Donation error:', err)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setProcessing(false)
    }
  }

  const presetAmounts = [25, 50, 100, 250, 500]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!organization) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 glass-card border-green-500/30 bg-slate-900/50">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-gray-300 mb-6">
              Your donation of {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.amount)} to {organization.name} has been processed successfully.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              A confirmation email has been sent to {formData.email}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={`/org/${slug}`}>
                <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
                  Back to {organization.name}
                </Button>
              </Link>
              <Link href="/organizations">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Browse Organizations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/org/${slug}`} className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-sm text-gray-400">Donating to</p>
              <h1 className="text-xl font-bold text-purple-400">{organization.name}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="glass-card border-purple-500/20 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Make a Donation
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your contribution makes a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              {/* Campaign Selection */}
              {campaigns.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Campaign (Optional)
                  </label>
                  <select
                    name="campaignId"
                    value={formData.campaignId}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-purple-500/30 px-3 py-2 bg-slate-800 text-white"
                  >
                    <option value="">General Donation</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Donation Amount *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetAmounts.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={formData.amount === String(preset) ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, amount: String(preset) }))}
                      className={formData.amount === String(preset) 
                        ? 'bg-purple-600 text-white' 
                        : 'border-purple-500/30 text-gray-300 hover:bg-purple-500/20'}
                    >
                      ${preset}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Other amount"
                    className="pl-7 bg-slate-800 border-purple-500/30 text-white"
                    min="1"
                    step="0.01"
                  />
                </div>
                {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
              </div>

              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Donation Type
                </label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={formData.donationType === 'ONE_TIME' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, donationType: 'ONE_TIME' }))}
                    className={formData.donationType === 'ONE_TIME' 
                      ? 'bg-purple-600 text-white' 
                      : 'border-purple-500/30 text-gray-300 hover:bg-purple-500/20'}
                  >
                    One-Time
                  </Button>
                  <Button
                    type="button"
                    variant={formData.donationType === 'RECURRING' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, donationType: 'RECURRING' }))}
                    className={formData.donationType === 'RECURRING' 
                      ? 'bg-purple-600 text-white' 
                      : 'border-purple-500/30 text-gray-300 hover:bg-purple-500/20'}
                  >
                    Monthly
                  </Button>
                </div>
              </div>

              <hr className="border-purple-500/20" />

              {/* Donor Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">First Name *</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Last Name *</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-slate-800 border-purple-500/30 text-white"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone (Optional)</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-slate-800 border-purple-500/30 text-white"
                />
              </div>

              <hr className="border-purple-500/20" />

              {/* Card Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-white">Payment Information</span>
                  <Badge variant="outline" className="ml-auto text-xs border-green-500/50 text-green-400">
                    <Lock className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Card Number *</label>
                    <Input
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="bg-slate-800 border-purple-500/30 text-white"
                    />
                    {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cardholder Name *</label>
                    <Input
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="bg-slate-800 border-purple-500/30 text-white"
                    />
                    {errors.cardName && <p className="text-red-400 text-sm mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Month *</label>
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-purple-500/30 px-3 py-2 bg-slate-800 text-white"
                      >
                        <option value="">MM</option>
                        {months.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Year *</label>
                      <select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-purple-500/30 px-3 py-2 bg-slate-800 text-white"
                      >
                        <option value="">YYYY</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">CVV *</label>
                      <Input
                        name="cvv"
                        value={formData.cvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                          setFormData(prev => ({ ...prev, cvv: val }))
                        }}
                        placeholder="123"
                        className="bg-slate-800 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                  {errors.expiry && <p className="text-red-400 text-sm">{errors.expiry}</p>}
                  {errors.cvv && <p className="text-red-400 text-sm">{errors.cvv}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-6 text-lg"
              >
                {processing ? (
                  'Processing...'
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Donate {formData.amount ? `$${formData.amount}` : ''}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-500">
                This is a simulated donation for demonstration purposes.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
