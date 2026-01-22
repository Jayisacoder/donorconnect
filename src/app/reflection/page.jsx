"use client"

import ProtectedGate from '@/components/protected-gate'

export const metadata = { title: 'Reflection | DonorConnect' }

export default function ReflectionPage() {
  return (
    <ProtectedGate>
      <div className="mx-auto max-w-4xl space-y-6 py-12 px-6">
        <h1 className="text-4xl font-bold text-white">Reflection</h1>
        <div className="space-y-4 text-gray-200">
          <section>
            <h2 className="text-xl font-semibold text-white">Biggest challenge</h2>
            <p>Balancing Next.js app router auth with Prisma multi-tenant filtering while keeping tests green and UI responsive.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">What I would change with more time</h2>
            <p>Deeper automation (tasks + workflows), richer analytics, and more granular AI coaching per segment.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">What I learned</h2>
            <p>Designing clean server components with Prisma, enforcing org scoping consistently, and shaping prompts to avoid leaking PII.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">How AI helped</h2>
            <p>AI accelerated copywriting for policy pages and synthesized donor history into actionable summaries; it did not replace validation or security review.</p>
          </section>
        </div>
      </div>
    </ProtectedGate>
  )
}
