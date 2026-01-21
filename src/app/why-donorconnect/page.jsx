export const metadata = { title: 'Why DonorConnect' }

export default function WhyDonorConnectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-12 px-6">
      <h1 className="text-4xl font-bold text-white">Why DonorConnect</h1>
      <p className="text-lg text-gray-300">A focused MVP built to move first-time donors to their second gift with clear data, guided actions, and automation.</p>
      <div className="space-y-4 text-gray-200">
        <section>
          <h2 className="text-xl font-semibold text-white">Solution idea</h2>
          <p>Centralize donors, donations, and campaigns; surface retention risk; give AI-generated context so staff send the right follow-up fast.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Key features & rationale</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Donor + donation CRUD tied to organizations for clean multi-tenant data.</li>
            <li>Dashboard metrics for totals, trends, and recent gifts to triage work.</li>
            <li>AI donor summaries to condense history and risk into one actionable paragraph.</li>
            <li>Role-based controls so only admins/staff can add gifts or donors.</li>
            <li>Transaction simulator to test workflows without real payments.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Expected challenges & planning</h2>
          <p>Ensuring auth compatibility with Next.js app router, keeping Prisma multi-tenant filters strict, and handling AI responsibly with minimal PII sent.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">System overview</h2>
          <p>Pages: Home, Problem, Why, AI Policy, Evidence, Reflection, Dashboard, Donors, Donations. Data: organizations, users, donors, donations, campaigns, sessions. APIs enforce org scoping; dashboard reads Prisma directly for accuracy.</p>
        </section>
      </div>
    </div>
  )
}
