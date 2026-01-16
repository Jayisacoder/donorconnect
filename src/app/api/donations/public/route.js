/**
 * Public Donation Processing API
 * Handles donations from public-facing donation form
 * NO authentication required (public endpoint)
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request) {
  try {
    console.log('=== PUBLIC DONATION REQUEST STARTED ===')
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const {
      firstName,
      lastName,
      email,
      phone,
      campaignId,
      amount,
      type,
      cardLast4,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !amount) {
      console.log('Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount
    const donationAmount = parseFloat(amount)
    if (isNaN(donationAmount) || donationAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      )
    }

    // SIMULATE CARD PROCESSING
    // In production, this would integrate with Stripe/PayPal/etc
    const cardProcessingResult = simulateCardProcessing(cardLast4)
    
    if (!cardProcessingResult.success) {
      return NextResponse.json(
        { error: 'Payment processing failed. Please try again.' },
        { status: 400 }
      )
    }

    // Get the first organization (in real app, would be based on subdomain/config)
    console.log('Fetching organization...')
    const organization = await prisma.organization.findFirst()
    console.log('Organization:', organization?.id)
    
    if (!organization) {
      console.log('ERROR: No organization found')
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 500 }
      )
    }

    // Find or create donor
    console.log('Looking for existing donor:', email)
    let donor = await prisma.donor.findFirst({
      where: {
        email,
        organizationId: organization.id,
      },
    })

    if (!donor) {
      // Create new donor
      console.log('Creating new donor...')
      donor = await prisma.donor.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          organizationId: organization.id,
          status: 'ACTIVE',
          totalGifts: 0,
          totalAmount: 0,
        },
      })
      console.log('New donor created:', donor.id)
    } else {
      console.log('Existing donor found:', donor.id)
    }

    // Create donation record
    console.log('Creating donation record...')
    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        campaignId: campaignId || null,
        amount: donationAmount,
        date: new Date(),
        type: type || 'ONE_TIME',
        method: 'CREDIT_CARD',
        notes: `Card ending in ${cardLast4}. Transaction ID: ${cardProcessingResult.transactionId}`,
      },
    })
    console.log('Donation created:', donation.id)

    // Update donor statistics
    const updatedStats = await prisma.donation.aggregate({
      where: { donorId: donor.id },
      _sum: { amount: true },
      _count: true,
    })

    await prisma.donor.update({
      where: { id: donor.id },
      data: {
        totalAmount: updatedStats._sum.amount || 0,
        totalGifts: updatedStats._count || 0,
        lastGiftDate: new Date(),
        firstGiftDate: donor.firstGiftDate || new Date(),
      },
    })

    // If donation is linked to campaign, update campaign stats
    if (campaignId) {
      const campaignStats = await prisma.donation.aggregate({
        where: { campaignId },
        _sum: { amount: true },
      })

      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          raised: campaignStats._sum.amount || 0,
        },
      })
    }

    console.log('=== DONATION SUCCESS ===')
    return NextResponse.json({
      success: true,
      donationId: donation.id,
      donorId: donor.id,
      amount: donationAmount,
      transactionId: cardProcessingResult.transactionId,
    })

  } catch (error) {
    console.error('Public donation error:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: 'Failed to process donation', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Simulate card processing
 * In production, integrate with Stripe, PayPal, etc.
 */
function simulateCardProcessing(cardLast4) {
  // Simulate network delay
  // In real app: await stripe.charges.create(...)
  
  // Generate fake transaction ID
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  // Always succeed in demo mode (change to Math.random() > 0.05 to test failures)
  const success = true
  
  return {
    success,
    transactionId: success ? transactionId : null,
    cardLast4,
  }
}
