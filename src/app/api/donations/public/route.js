/**
 * Public Donation Processing API
 * Handles donations from public-facing donation form
 * NO authentication required (public endpoint)
 * Supports multi-org via organizationId parameter
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateDonorMetrics } from '@/lib/api/donors'
import { triggerWorkflows } from '@/lib/api/workflows'

export async function POST(request) {
  try {
    console.log('=== PUBLIC DONATION REQUEST STARTED ===')
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const {
      organizationId, // New: explicit organization ID for multi-org support
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

    // Get organization - either by explicit ID or fallback to first
    console.log('Fetching organization...')
    let organization
    if (organizationId) {
      organization = await prisma.organization.findUnique({
        where: { id: organizationId }
      })
      if (!organization || !organization.isPublic) {
        return NextResponse.json(
          { error: 'Organization not found' },
          { status: 404 }
        )
      }
    } else {
      // Fallback for legacy: use first organization
      organization = await prisma.organization.findFirst()
    }
    console.log('Organization:', organization?.id)
    
    if (!organization) {
      console.log('ERROR: No organization found')
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 500 }
      )
    }

    // Verify campaign belongs to organization if provided
    if (campaignId) {
      const campaign = await prisma.campaign.findFirst({
        where: { id: campaignId, organizationId: organization.id }
      })
      if (!campaign) {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
    }

    // Find or create donor
    console.log('Looking for existing donor:', email)
    let donor = await prisma.donor.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        organizationId: organization.id,
      },
    })

    const isNewDonor = !donor

    if (!donor) {
      // Create new donor
      console.log('Creating new donor...')
      donor = await prisma.donor.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone?.trim() || null,
          organizationId: organization.id,
          status: 'ACTIVE',
          retentionRisk: 'UNKNOWN',
          totalGifts: 0,
          totalAmount: 0,
        },
      })
      console.log('New donor created:', donor.id)
    } else {
      console.log('Existing donor found:', donor.id)
      // Update donor info
      await prisma.donor.update({
        where: { id: donor.id },
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone?.trim() || donor.phone,
          status: 'ACTIVE',
        },
      })
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

    // Trigger workflows for the donation
    try {
      const donationCount = await prisma.donation.count({ where: { donorId: donor.id } })
      const isFirstDonation = donationCount === 1

      await triggerWorkflows({
        trigger: isFirstDonation ? 'FIRST_DONATION' : 'DONATION_RECEIVED',
        organizationId: organization.id,
        donorId: donor.id,
        context: {
          donationId: donation.id,
          amount: donation.amount,
          campaignId: donation.campaignId,
          isNewDonor,
          source: 'public_website',
        },
      })
    } catch (workflowError) {
      console.error('Workflow trigger error:', workflowError)
      // Don't fail the donation if workflow fails
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
