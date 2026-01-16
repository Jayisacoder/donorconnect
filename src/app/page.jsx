/**
 * Root Homepage - Public landing page
 * Moved from (public)/page.jsx to be at root URL
 */
"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Heart, Users, TrendingUp, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Public Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">DonorConnect</h1>
              <p className="text-sm text-gray-600">Making a difference together</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/donate">
                <Button variant="ghost">Donate</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Staff Login</Button>
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
            <h2 className="text-5xl font-bold mb-4">
              Make a Difference Today
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your generosity helps us build stronger communities and create lasting impact. 
              Every donation matters.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/donate">
                <Button size="lg" className="text-lg px-8">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">1,250+</p>
                <p className="text-gray-600">Active Donors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">$2.5M</p>
                <p className="text-gray-600">Raised This Year</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">50+</p>
                <p className="text-gray-600">Active Campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Why Donate Section */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8">Why Your Donation Matters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Direct Impact</CardTitle>
                  <CardDescription>
                    100% of your donation goes directly to our programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Every dollar makes a meaningful difference in the lives of those we serve.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transparent Reporting</CardTitle>
                  <CardDescription>
                    See exactly how your contribution is being used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Receive regular updates showing the impact of your generosity.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tax Deductible</CardTitle>
                  <CardDescription>
                    All donations are fully tax-deductible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    You'll receive an immediate receipt. We're a registered 501(c)(3) nonprofit.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Secure Giving
                  </CardTitle>
                  <CardDescription>
                    Your information is protected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We use industry-standard encryption to protect your information.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary/10 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h3>
            <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
              Join thousands of donors making a difference. Every contribution counts.
            </p>
            <Link href="/donate">
              <Button size="lg" className="text-lg px-8">
                <Heart className="h-5 w-5 mr-2" />
                Start Giving Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-2">About</h4>
              <p className="text-sm text-gray-400">
                DonorConnect helps nonprofits manage donor relationships.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Contact</h4>
              <p className="text-sm text-gray-400">
                Email: support@donorconnect.org<br />
                Phone: (555) 123-4567
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Secure Giving</h4>
              <p className="text-sm text-gray-400">
                All donations are processed securely.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2025 DonorConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
