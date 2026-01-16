"use client"

import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Heart, Download, Mail } from 'lucide-react'
import Link from 'next/link'

/**
 * Donation Success/Thank You Page
 * Shown after successful donation
 */
export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const donationId = searchParams.get('id')

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl text-gray-600">
          Your generosity makes a real difference
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Donation Was Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="font-mono font-semibold text-green-700">
              {donationId || 'TXN_XXXXXXXXXX'}
            </p>
          </div>

          <div className="text-left space-y-3 pt-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Confirmation Email Sent</p>
                <p className="text-sm text-gray-600">
                  A receipt has been sent to your email address for tax purposes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Tax Receipt</p>
                <p className="text-sm text-gray-600">
                  You can download your tax receipt from the email we sent you.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">What Happens Next?</h3>
          <p className="text-sm text-gray-700">
            Your donation will be used to support our mission and make a positive impact 
            in the community. You'll receive updates on how your contribution is making 
            a difference. Thank you for being part of our journey!
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/donate">
          <Button variant="outline" size="lg">
            <Heart className="h-4 w-4 mr-2" />
            Make Another Donation
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg">
            Return to Home
          </Button>
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t">
        <p className="text-sm text-gray-600">
          Questions about your donation? Contact us at{' '}
          <a href="mailto:support@donorconnect.org" className="text-primary hover:underline">
            support@donorconnect.org
          </a>
        </p>
      </div>
    </div>
  )
}
