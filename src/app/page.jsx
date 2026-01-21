/**
 * Root Homepage - Public landing page
 * Displays real database stats
 */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Heart, Users, TrendingUp, Shield } from 'lucide-react'
import { prisma } from '@/lib/db'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default async function HomePage() {
  // Fetch real data from database
  let stats = {
    totalDonors: 0,
    totalRaised: 0,
    activeCampaigns: 0,
  }

  try {
    const [donors, campaigns, donations] = await Promise.all([
      prisma.donor.findMany({
        select: { id: true },
      }),
      prisma.campaign.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true },
      }),
      prisma.donation.findMany({
        select: { amount: true },
      }),
    ])

    stats.totalDonors = donors.length
    stats.activeCampaigns = campaigns.length
    stats.totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
  } catch (error) {
    console.error('Failed to fetch homepage stats:', error)
    // Fallback to zeros if DB unavailable
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Public Header */}
      <header className="bg-slate-900/50 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-400">DonorConnect</h1>
              <p className="text-sm text-gray-400">Making a difference together</p>
            </div>
            <nav className="flex gap-4 items-center">
              <Link href="/about">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">About</Button>
              </Link>
              <Link href="/why-donorconnect">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">Why DonorConnect</Button>
              </Link>
              <Link href="/donate">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">Donate</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-slate-950 text-white border border-purple-500/50 hover:bg-purple-500/20">Staff Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center py-12">
            <Heart className="h-20 w-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl font-bold mb-4 text-white">
              DonorConnect
            </h2>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto font-semibold">
              <strong className="text-white">Problem:</strong> Nonprofits lose 70% of first-time donors before their second gift due to disconnected data and missed follow-ups.
            </p>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-semibold">
              <strong className="text-white">Solution:</strong> DonorConnect centralizes donor management, automates retention workflows, and uses AI to personalize outreach—helping nonprofits convert more first-time donors into lifelong supporters.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/donate">
                <Button size="lg" className="text-lg px-8 bg-slate-950 text-white border border-purple-500/50 hover:bg-purple-500/20">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section - Real Data from Database */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center border border-emerald-500/20 bg-emerald-500/5">
              <Users className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{stats.totalDonors}</p>
              <p className="text-gray-400">Active Donors</p>
            </div>
            <div className="glass-card p-6 text-center border border-green-500/20 bg-green-500/5">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalRaised)}</p>
              <p className="text-gray-400">Total Raised</p>
            </div>
            <div className="glass-card p-6 text-center border border-pink-500/20 bg-pink-500/5">
              <Heart className="h-12 w-12 text-pink-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{stats.activeCampaigns}</p>
              <p className="text-gray-400">Active Campaigns</p>
            </div>
          </div>

          {/* Why Donate Section */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8 text-white">Why Your Donation Matters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 border border-purple-500/20">
                <h4 className="text-xl font-bold text-white mb-2">Direct Impact</h4>
                <p className="text-sm text-gray-400 mb-3">100% of your donation goes directly to our programs</p>
                <p className="text-gray-300">
                  Every dollar makes a meaningful difference in the lives of those we serve.
                </p>
              </div>
              <div className="glass-card p-6 border border-purple-500/20">
                <h4 className="text-xl font-bold text-white mb-2">Transparent Reporting</h4>
                <p className="text-sm text-gray-400 mb-3">See exactly how your contribution is being used</p>
                <p className="text-gray-300">
                  Receive regular updates showing the impact of your generosity.
                </p>
              </div>
              <div className="glass-card p-6 border border-purple-500/20">
                <h4 className="text-xl font-bold text-white mb-2">Tax Deductible</h4>
                <p className="text-sm text-gray-400 mb-3">All donations are fully tax-deductible</p>
                <p className="text-gray-300">
                  You'll receive an immediate receipt. We're a registered 501(c)(3) nonprofit.
                </p>
              </div>
              <div className="glass-card p-6 border border-purple-500/20">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Secure Giving
                </h4>
                <p className="text-sm text-gray-400 mb-3">Your information is protected</p>
                <p className="text-gray-300">
                  We use industry-standard encryption to protect your information.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="glass-card p-12 text-center border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <h3 className="text-3xl font-bold mb-4 text-white">Ready to Make an Impact?</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              Join thousands of donors making a difference. Every contribution counts.
            </p>
            <Link href="/donate">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                <Heart className="h-5 w-5 mr-2" />
                Start Giving Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-purple-500/20 text-gray-400 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-2 text-white">About</h4>
              <p className="text-sm">
                DonorConnect helps nonprofits manage donor relationships and increase retention.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-white">Contact</h4>
              <p className="text-sm">
                Email: support@donorconnect.org<br />
                Phone: (555) 123-4567
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-white">Secure Giving</h4>
              <p className="text-sm">
                All donations are processed securely with industry-standard encryption.
              </p>
            </div>
          </div>
          <div className="border-t border-purple-500/20 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2025 DonorConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
