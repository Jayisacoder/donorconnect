"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Heart, Users, TrendingUp, Shield } from 'lucide-react'

/**
 * Public Homepage
 */
export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-12">
        <Heart className="h-20 w-20 text-red-500 mx-auto mb-6 animate-pulse" />
        <h1 className="text-5xl font-bold mb-4">
          Make a Difference Today
        </h1>
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
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Staff Login
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
        <h2 className="text-3xl font-bold text-center mb-8">Why Your Donation Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Direct Impact</CardTitle>
              <CardDescription>
                100% of your donation goes directly to our programs and initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We ensure every dollar makes a meaningful difference in the lives of 
                those we serve. No overhead, just pure impact.
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
                Receive regular updates and detailed reports showing the impact of 
                your generosity on our community.
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
                You'll receive an immediate receipt for your records. We're a 
                registered 501(c)(3) nonprofit organization.
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
                Your information is protected and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We use industry-standard encryption and security measures to protect 
                your personal and payment information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
          Join thousands of donors who are making a difference in our community. 
          Every contribution helps us reach our goals.
        </p>
        <Link href="/donate">
          <Button size="lg" className="text-lg px-8">
            <Heart className="h-5 w-5 mr-2" />
            Start Giving Today
          </Button>
        </Link>
      </div>

      {/* Contact Section */}
      <div className="text-center py-8 border-t">
        <h3 className="font-semibold mb-2">Questions?</h3>
        <p className="text-gray-600">
          Contact us at{' '}
          <a href="mailto:support@donorconnect.org" className="text-primary hover:underline">
            support@donorconnect.org
          </a>
          {' '}or call{' '}
          <a href="tel:+15551234567" className="text-primary hover:underline">
            (555) 123-4567
          </a>
        </p>
      </div>
    </div>
  )
}
