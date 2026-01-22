import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const organizationId = session.user.organizationId

    // Get segment
    const segment = await prisma.segment.findFirst({
      where: { id, organizationId },
    })

    if (!segment) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 })
    }

    // Delete existing members
    await prisma.segmentMember.deleteMany({
      where: { segmentId: id },
    })

    // Find matching donors
    const matchingDonors = await findMatchingDonors(organizationId, segment.rules)
    
    // Add new members
    if (matchingDonors.length > 0) {
      await prisma.segmentMember.createMany({
        data: matchingDonors.map(donor => ({
          segmentId: id,
          donorId: donor.id,
        })),
        skipDuplicates: true,
      })
    }

    // Update segment
    await prisma.segment.update({
      where: { id },
      data: {
        memberCount: matchingDonors.length,
        lastCalculated: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      memberCount: matchingDonors.length 
    })
  } catch (error) {
    console.error('Error recalculating segment:', error)
    return NextResponse.json({ error: 'Failed to recalculate segment' }, { status: 500 })
  }
}

// Helper function to find matching donors based on rules
async function findMatchingDonors(organizationId, rules) {
  const where = { organizationId }

  if (rules.retentionRisk && rules.retentionRisk.length > 0) {
    where.retentionRisk = { in: rules.retentionRisk }
  }

  if (rules?.status?.length) {
    where.status = { in: rules.status }
  }

  // Support both giftCountRange (new) and totalGiftsRange (old) for backward compatibility
  const giftRange = rules?.giftCountRange || rules?.totalGiftsRange
  if (giftRange) {
    where.totalGifts = {}
    if (giftRange.min !== undefined) where.totalGifts.gte = giftRange.min
    if (giftRange.max !== undefined) where.totalGifts.lte = giftRange.max
  }

  // Support both totalGiftAmountRange (new) and totalAmountRange (old) for backward compatibility
  const amountRange = rules?.totalGiftAmountRange || rules?.totalAmountRange
  if (amountRange) {
    where.totalAmount = {}
    if (amountRange.min !== undefined) where.totalAmount.gte = amountRange.min
    if (amountRange.max !== undefined) where.totalAmount.lte = amountRange.max
  }

  if (rules?.lastGiftDateRange) {
    const { start, end } = rules.lastGiftDateRange
    where.lastGiftDate = {}
    if (start) where.lastGiftDate.gte = new Date(start)
    if (end) where.lastGiftDate.lte = new Date(end)
  }

  // Legacy field support
  if (rules?.daysSinceLastGift !== undefined) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - rules.daysSinceLastGift)
    where.lastGiftDate = { lt: cutoffDate }
  }

  if (rules.hasEmail === true) {
    where.email = { not: null }
  } else if (rules.hasEmail === false) {
    where.email = null
  }

  return await prisma.donor.findMany({
    where,
    select: { id: true },
  })
}
