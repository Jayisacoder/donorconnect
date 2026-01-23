// Campaigns API - Individual Operations
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { updateCampaignSchema } from '@/lib/validation/campaign-schema'

export async function GET(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const campaign = await prisma.campaign.findFirst({
      where: { id, organizationId: session.user.organizationId },
      include: {
        donations: {
          include: {
            donor: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { donationDate: 'desc' }
        }
      }
    })

    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Calculate total raised for this campaign
    const totalRaised = campaign.donations.reduce((sum, d) => sum + (d.amount || 0), 0)

    return NextResponse.json({ campaign: { ...campaign, totalRaised } })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!['ADMIN', 'STAFF', 'MARKETING'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateCampaignSchema.parse(body)

    const campaign = await prisma.campaign.update({
      where: { id },
      data,
    })

    return NextResponse.json({ campaign })
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
    await prisma.campaign.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}