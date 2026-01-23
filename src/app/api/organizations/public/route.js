// Public Organizations API - List public organizations
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const organizations = await prisma.organization.findMany({
      where: {
        isPublic: true,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : {})
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        _count: {
          select: {
            donors: true,
            campaigns: { where: { status: 'ACTIVE' } }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Get donation totals for each org
    const orgsWithStats = await Promise.all(
      organizations.map(async (org) => {
        const donations = await prisma.donation.aggregate({
          where: { donor: { organizationId: org.id } },
          _sum: { amount: true }
        })
        return {
          ...org,
          donorCount: org._count.donors,
          activeCampaigns: org._count.campaigns,
          totalRaised: donations._sum.amount || 0,
        }
      })
    )

    return NextResponse.json({ organizations: orgsWithStats })
  } catch (error) {
    console.error('Error fetching public organizations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
