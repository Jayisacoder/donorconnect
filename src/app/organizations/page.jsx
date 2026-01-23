/**
 * Organizations Directory Page
 * Browse all public organizations on the platform
 */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Heart, Users, TrendingUp, Building2, Search, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function OrganizationsPage() {
  // Fetch all public organizations with their stats
  const organizations = await prisma.organization.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true,
      _count: {
        select: {
          donors: true,
          campaigns: { where: { status: 'ACTIVE' } }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  // Get donation totals for each org
  const orgsWithStats = await Promise.all(
    organizations.map(async (org) => {
      const donations = await prisma.donation.aggregate({
        where: { donor: { organizationId: org.id } },
        _sum: { amount: true }
      })
      return {
        ...org,
        donorCount: org._count.donors,
        activeCampaigns: org._count.campaigns,
        totalRaised: donations._sum.amount || 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div>
                <h1 className="text-2xl font-bold text-purple-400">DonorConnect</h1>
                <p className="text-sm text-gray-400">Making a difference together</p>
              </div>
            </Link>
            <nav className="flex gap-4 items-center">
              <Link href="/">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">Home</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                  Register Your Nonprofit
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero */}
          <div className="text-center py-8">
            <Building2 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Find an Organization to Support
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Browse nonprofits using DonorConnect and make a difference today.
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-4 text-center border border-purple-500/20">
              <p className="text-2xl font-bold text-white">{orgsWithStats.length}</p>
              <p className="text-sm text-gray-400">Organizations</p>
            </div>
            <div className="glass-card p-4 text-center border border-purple-500/20">
              <p className="text-2xl font-bold text-white">
                {orgsWithStats.reduce((sum, org) => sum + org.donorCount, 0)}
              </p>
              <p className="text-sm text-gray-400">Total Donors</p>
            </div>
            <div className="glass-card p-4 text-center border border-purple-500/20">
              <p className="text-2xl font-bold text-white">
                {formatCurrency(orgsWithStats.reduce((sum, org) => sum + org.totalRaised, 0))}
              </p>
              <p className="text-sm text-gray-400">Total Raised</p>
            </div>
          </div>

          {/* Organizations Grid */}
          {orgsWithStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgsWithStats.map((org) => (
                <Link key={org.id} href={`/org/${org.slug}`}>
                  <Card className="h-full glass-card border-purple-500/20 bg-slate-900/50 hover:border-purple-500/40 hover:bg-slate-900/70 transition-all cursor-pointer group">
                    <CardHeader>
                      <CardTitle className="text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                        {org.name}
                        <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                      </CardTitle>
                      {org.description && (
                        <CardDescription className="text-gray-400 line-clamp-2">
                          {org.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Users className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{org.donorCount}</p>
                          <p className="text-xs text-gray-500">Donors</p>
                        </div>
                        <div>
                          <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{formatCurrency(org.totalRaised)}</p>
                          <p className="text-xs text-gray-500">Raised</p>
                        </div>
                        <div>
                          <Heart className="h-5 w-5 text-pink-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{org.activeCampaigns}</p>
                          <p className="text-xs text-gray-500">Campaigns</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400">No organizations found.</p>
              <Link href="/register" className="mt-4 inline-block">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Register Your Nonprofit
                </Button>
              </Link>
            </div>
          )}

          {/* CTA for Nonprofits */}
          <div className="glass-card p-12 text-center border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 mt-12">
            <h3 className="text-2xl font-bold mb-4 text-white">Are You a Nonprofit?</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              Join DonorConnect to manage your donors, automate follow-ups, and increase donor retention.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-purple-500/20 text-gray-400 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            © 2025 DonorConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
