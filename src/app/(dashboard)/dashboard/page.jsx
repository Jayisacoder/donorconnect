import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, TrendingUp, AlertCircle, Plus, UserPlus, Calendar, Clock, Gift, Target } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch data directly from database using organizationId
  const [donors, donations, campaigns, tasks] = await Promise.all([
    prisma.donor.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.findMany({
      where: { donor: { organizationId: user.organizationId } },
      include: { donor: true },
      orderBy: { date: 'desc' },
      take: 20,
    }),
    prisma.campaign.findMany({
      where: { organizationId: user.organizationId, status: 'ACTIVE' },
      orderBy: { startDate: 'desc' },
      take: 5,
    }),
    prisma.task.findMany({
      where: { donor: { organizationId: user.organizationId } },
      orderBy: { dueDate: 'asc' },
    }),
  ])

  const totalRaised = donors.reduce((sum, d) => sum + (d.totalAmount || 0), 0)
  const activeDonors = donors.filter(d => d.status === 'ACTIVE').length
  const newDonors = donors.filter(d => d.status === 'NEW').length
  const lapsedDonors = donors.filter(d => d.status === 'LAPSED').length
  
  const thisMonthDonations = donations.filter(d => {
    const date = new Date(d.date)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const thisMonthRaised = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0)

  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length
  const highPriorityTasks = tasks.filter(t => t.status !== 'DONE' && (t.priority === 'HIGH' || t.priority === 'URGENT')).length
  
  // Get upcoming tasks (next 7 days)
  const now = new Date()
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const upcomingTasks = tasks
    .filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) <= nextWeek)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)
  
  // Get recent donors (last 30 days)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentNewDonors = donors.filter(d => new Date(d.createdAt) >= thirtyDaysAgo).length
  
  // Get at-risk donors
  const atRiskDonors = donors.filter(d => d.retentionRisk === 'HIGH' || d.retentionRisk === 'CRITICAL').length

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-3 text-lg">Welcome back! Here's what's happening with your donors.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/donors/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Donor
              </Button>
            </Link>
            <Link href="/donations/new">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Log Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/donors">
          <Card className="hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Donors</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 transition-transform hover:scale-110" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{donors.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {activeDonors} active, {newDonors} new, {lapsedDonors} lapsed
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/donations">
          <Card className="hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Raised</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 transition-transform hover:scale-110" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{formatCurrency(totalRaised)}</div>
              <p className="text-xs text-gray-500 mt-1">{donations.length} donations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/donations">
          <Card className="hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">This Month</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 transition-transform hover:scale-110" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{formatCurrency(thisMonthRaised)}</div>
              <p className="text-xs text-gray-500 mt-1">{thisMonthDonations.length} donations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tasks">
          <Card className="hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50/50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending Tasks</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 transition-transform hover:scale-110" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{pendingTasks}</div>
              <p className="text-xs text-gray-500 mt-1">{highPriorityTasks} high priority</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming tasks in the next 7 days.</p>
            ) : (
              upcomingTasks.map((task) => {
                const dueDate = new Date(task.dueDate)
                const isOverdue = dueDate < now
                const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                
                return (
                  <Link key={task.id} href="/tasks">
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {isOverdue ? 'Overdue' : daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days`}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            task.priority === 'URGENT' ? 'bg-red-100 text-red-700 border-red-300' :
                            task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                            'bg-blue-100 text-blue-700 border-blue-300'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.length === 0 ? (
              <p className="text-sm text-gray-500">No active campaigns.</p>
            ) : (
              campaigns.slice(0, 3).map((campaign) => {
                const progress = campaign.goalAmount > 0 ? (campaign.currentAmount / campaign.goalAmount) * 100 : 0
                return (
                  <Link key={campaign.id} href="/campaigns">
                    <div className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{campaign.name}</span>
                        <span className="font-bold text-green-600">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {formatCurrency(campaign.currentAmount)} of {formatCurrency(campaign.goalAmount)} raised
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {donations.length === 0 ? (
              <p className="text-sm text-gray-500">No recent donations.</p>
            ) : (
              donations.slice(0, 5).map((donation) => (
                <Link key={donation.id} href={`/donors/${donation.donor?.id}`}>
                  <div className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0 p-2 rounded hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">
                        {donation.donor?.firstName} {donation.donor?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm font-bold text-green-600">{formatCurrency(donation.amount)}</div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-xl transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Donor Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">New Donors (30 days)</p>
                <p className="text-xs text-gray-500 mt-1">Recently joined supporters</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{recentNewDonors}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">At-Risk Donors</p>
                <p className="text-xs text-gray-500 mt-1">Need attention to retain</p>
              </div>
              <div className="text-2xl font-bold text-orange-600">{atRiskDonors}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Active Donors</p>
                <p className="text-xs text-gray-500 mt-1">Currently engaged</p>
              </div>
              <div className="text-2xl font-bold text-green-600">{activeDonors}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-200 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Average Gift Size</p>
                <p className="text-xs text-gray-500 mt-1">Per donation</p>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(donations.length > 0 ? totalRaised / donations.length : 0)}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Donations This Month</p>
                <p className="text-xs text-gray-500 mt-1">Total received</p>
              </div>
              <div className="text-2xl font-bold text-green-600">{thisMonthDonations.length}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Active Campaigns</p>
                <p className="text-xs text-gray-500 mt-1">Currently running</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{campaigns.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
