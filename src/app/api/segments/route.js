// Segments API - List and Create
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { createSegmentSchema, segmentListQuerySchema } from '@/lib/validation/segment-schema'

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const params = segmentListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams))

    const where = {
      organizationId: session.user.organizationId,
      ...(params.search
        ? {
            name: { contains: params.search, mode: 'insensitive' },
          }
        : {}),
    }

    const skip = (params.page - 1) * params.limit

    const [segments, total] = await Promise.all([
      prisma.segment.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { [params.sortBy]: params.sortOrder },
      }),
      prisma.segment.count({ where }),
    ])

    return NextResponse.json({ segments, pagination: { total, page: params.page, limit: params.limit } })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const role = session.user.role
    if (!['ADMIN', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const data = createSegmentSchema.parse(body)
    const organizationId = session.user.organizationId

    // Create segment
    const segment = await prisma.segment.create({
      data: {
        ...data,
        organizationId,
        lastCalculated: new Date(),
      },
    })

    // Calculate and add matching donors
    const matchingDonors = await findMatchingDonors(organizationId, data.rules)
    
    if (matchingDonors.length > 0) {
      await prisma.segmentMember.createMany({
        data: matchingDonors.map(donor => ({
          segmentId: segment.id,
          donorId: donor.id,
        })),
        skipDuplicates: true,
      })

      // Update member count
      await prisma.segment.update({
        where: { id: segment.id },
        data: { memberCount: matchingDonors.length },
      })
    }

    return NextResponse.json({ segment, memberCount: matchingDonors.length }, { status: 201 })
  } catch (error) {
    console.error('Error creating segment:', error)
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