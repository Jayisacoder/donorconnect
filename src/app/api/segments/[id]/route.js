// Segments API - Individual Operations
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { updateSegmentSchema } from '@/lib/validation/segment-schema'

export async function GET(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const segment = await prisma.segment.findFirst({
      where: { id, organizationId: session.user.organizationId },
    })

    if (!segment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ segment })
  } catch (error) {
    console.error('Error fetching segment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateSegmentSchema.parse(body)
    const organizationId = session.user.organizationId

    // Update segment
    const segment = await prisma.segment.update({
      where: { id },
      data: {
        ...data,
        lastCalculated: new Date(),
      },
    })

    // If rules changed, recalculate members
    if (data.rules) {
      // Delete existing members
      await prisma.segmentMember.deleteMany({
        where: { segmentId: id },
      })

      // Find and add new matching donors
      const matchingDonors = await findMatchingDonors(organizationId, data.rules)
      
      if (matchingDonors.length > 0) {
        await prisma.segmentMember.createMany({
          data: matchingDonors.map(donor => ({
            segmentId: id,
            donorId: donor.id,
          })),
          skipDuplicates: true,
        })
      }

      // Update member count
      await prisma.segment.update({
        where: { id },
        data: { memberCount: matchingDonors.length },
      })
    }

    return NextResponse.json({ segment })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    await prisma.segment.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to find matching donors based on rules
async function findMatchingDonors(organizationId, rules) {
  const where = { organizationId }

  if (rules.retentionRisk && rules.retentionRisk.length > 0) {
    where.retentionRisk = { in: rules.retentionRisk }
  }

  if (rules.status && rules.status.length > 0) {
    where.status = { in: rules.status }
  }

  if (rules.totalGiftsRange) {
    where.totalGifts = {}
    if (rules.totalGiftsRange.min !== undefined) {
      where.totalGifts.gte = rules.totalGiftsRange.min
    }
    if (rules.totalGiftsRange.max !== undefined) {
      where.totalGifts.lte = rules.totalGiftsRange.max
    }
  }

  if (rules.totalAmountRange) {
    where.totalAmount = {}
    if (rules.totalAmountRange.min !== undefined) {
      where.totalAmount.gte = rules.totalAmountRange.min
    }
    if (rules.totalAmountRange.max !== undefined) {
      where.totalAmount.lte = rules.totalAmountRange.max
    }
  }

  if (rules.daysSinceLastGift !== undefined) {
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