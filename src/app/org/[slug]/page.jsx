/**
 * Public Organization Page
 * Shows organization info, campaigns, and donation button
 */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Heart, Users, TrendingUp, Target, ExternalLink, ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatPercent(raised, goal) {
  if (!goal || goal === 0) return 0
  return Math.min(100, Math.round((raised / goal) * 100))
}

export default async function OrganizationPage({ params }) {
  const { slug } = await params

  // Fetch organization data
  const organization = await prisma.organization.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      website: true,
      logo: true,
      isPublic: true,
    }
  })

  if (!organization || !organization.isPublic) {
    notFound()
  }

  // Get stats for this organization
  const [donorCount, activeCampaignCount, donations, campaigns] = await Promise.all([
    prisma.donor.count({ where: { organizationId: organization.id } }),
    prisma.campaign.count({ where: { organizationId: organization.id, status: 'ACTIVE' } }),
    prisma.donation.aggregate({
      where: { donor: { organizationId: organization.id } },
      _sum: { amount: true }
    }),
    prisma.campaign.findMany({
      where: { 
        organizationId: organization.id, 
        status: 'ACTIVE' 
      },
      select: {
        id: true,
        name: true,
        description: true,
        goal: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    })
  ])

  // Get campaign totals
  const campaignsWithTotals = await Promise.all(
    campaigns.map(async (campaign) => {
      const campaignDonations = await prisma.donation.aggregate({
        where: { campaignId: campaign.id },
        _sum: { amount: true }
      })
      return {
        ...campaign,
        raised: campaignDonations._sum.amount || 0
      }
    })
  )

  const totalRaised = donations._sum.amount || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/organizations" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-purple-400">{organization.name}</h1>
                {organization.website && (
                  <a 
                    href={organization.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-purple-400 flex items-center gap-1"
                  >
                    {organization.website} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <Link href={`/org/${slug}/donate`}>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Description */}
          {organization.description && (
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xl text-gray-300">{organization.description}</p>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center border border-emerald-500/20 bg-emerald-500/5">
              <Users className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{donorCount}</p>
              <p className="text-gray-400">Donors</p>
            </div>
            <div className="glass-card p-6 text-center border border-green-500/20 bg-green-500/5">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(totalRaised)}</p>
              <p className="text-gray-400">Total Raised</p>
            </div>
            <div className="glass-card p-6 text-center border border-pink-500/20 bg-pink-500/5">
              <Target className="h-12 w-12 text-pink-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{activeCampaignCount}</p>
              <p className="text-gray-400">Active Campaigns</p>
            </div>
          </div>

          {/* Active Campaigns */}
          {campaignsWithTotals.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Active Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaignsWithTotals.map((campaign) => {
                  const percent = formatPercent(campaign.raised, campaign.goal)
                  return (
                    <Card key={campaign.id} className="glass-card border-purple-500/20 bg-slate-900/50">
                      <CardHeader>
                        <CardTitle className="text-white">{campaign.name}</CardTitle>
                        {campaign.description && (
                          <CardDescription className="text-gray-400">
                            {campaign.description.length > 100 
                              ? `${campaign.description.substring(0, 100)}...` 
                              : campaign.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Raised</span>
                            <span className="text-white font-medium">{formatCurrency(campaign.raised)}</span>
                          </div>
                          {campaign.goal && (
                            <>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">{percent}% of goal</span>
                                <span className="text-gray-400">{formatCurrency(campaign.goal)}</span>
                              </div>
                            </>
                          )}
                          <Link href={`/org/${slug}/donate?campaign=${campaign.id}`}>
                            <Button variant="outline" className="w-full mt-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
                              <Heart className="h-4 w-4 mr-2" />
                              Donate to this campaign
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="glass-card p-12 text-center border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <h3 className="text-3xl font-bold mb-4 text-white">Support {organization.name}</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              Your donation helps us continue our mission and make a lasting impact.
            </p>
            <Link href={`/org/${slug}/donate`}>
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                <Heart className="h-5 w-5 mr-2" />
                Make a Donation
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-purple-500/20 text-gray-400 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              Donation page powered by <Link href="/" className="text-purple-400 hover:text-purple-300">DonorConnect</Link>
            </div>
            <div className="text-sm">
              <Link href="/organizations" className="text-gray-400 hover:text-white">Browse Organizations</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
