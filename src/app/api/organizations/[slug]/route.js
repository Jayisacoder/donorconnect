// Public Organization API - Get organization by slug
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { slug } = await params

    const organization = await prisma.organization.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        website: true,
        logo: true,
        isPublic: true,
      }
    })

    if (!organization || !organization.isPublic) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Get stats for this organization
    const [donorCount, activeCampaigns, donations, campaigns] = await Promise.all([
      prisma.donor.count({ where: { organizationId: organization.id } }),
      prisma.campaign.count({ where: { organizationId: organization.id, status: 'ACTIVE' } }),
      prisma.donation.aggregate({
        where: { donor: { organizationId: organization.id } },
        _sum: { amount: true }
      }),
      prisma.campaign.findMany({
        where: { 
          organizationId: organization.id, 
          status: 'ACTIVE' 
        },
        select: {
          id: true,
          name: true,
          description: true,
          goal: true,
          startDate: true,
          endDate: true,
          _count: {
            select: { donations: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    // Get campaign totals
    const campaignsWithTotals = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignDonations = await prisma.donation.aggregate({
          where: { campaignId: campaign.id },
          _sum: { amount: true }
        })
        return {
          ...campaign,
          raised: campaignDonations._sum.amount || 0,
          donationCount: campaign._count.donations
        }
      })
    )

    return NextResponse.json({ 
      organization: {
        ...organization,
        donorCount,
        activeCampaigns,
        totalRaised: donations._sum.amount || 0,
        campaigns: campaignsWithTotals
      }
    })
  } catch (error) {
    console.error('Error fetching organization:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
