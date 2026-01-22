"use client"

import ProtectedGate from '@/components/protected-gate'

export const metadata = { title: 'Evidence & Rubric | DonorConnect' }

export default function EvidencePage() {
  return (
    <ProtectedGate>
      <div className="mx-auto max-w-4xl space-y-8 py-12 px-6">
        <h1 className="text-4xl font-bold text-white">Evidence & Rubric</h1>
        <p className="text-lg text-gray-300">Direct links to where criteria are implemented inside the app.</p>

        <section className="space-y-3 text-gray-200">
          <h2 className="text-2xl font-semibold text-white">CCC.1.3 – Implement a solution</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Dashboard MVP: <a className="text-blue-400 underline" href="/dashboard">/dashboard</a> – totals and quick stats.</li>
            <li>Donors CRUD: <a className="text-blue-400 underline" href="/donors">/donors</a> – list + add form with persistence.</li>
            <li>Donations CRUD: <a className="text-blue-400 underline" href="/donations">/donations</a> – list + add form linked to donor.</li>
            <li>Campaigns: <a className="text-blue-400 underline" href="/campaigns">/campaigns</a> – filters, cards, status.</li>
            <li>Workflows: <a className="text-blue-400 underline" href="/workflows">/workflows</a> – builder form and status.</li>
            <li>Source code: <a className="text-blue-400 underline" href="https://github.com/LaunchPadPhilly/donorconnect-bc2-Jayisacoder">GitHub</a> • Live: <a className="text-blue-400 underline" href="https://donorconnect.vercel.app">Vercel</a></li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-200">
          <h2 className="text-2xl font-semibold text-white">TS.6.2 – Use AI responsibly</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>AI Policy page: <a className="text-blue-400 underline" href="/ai-policy">/ai-policy</a> – ethics, privacy, safeguards.</li>
            <li>Session security: cookies + org scoping in API – see protected dashboard routes.</li>
            <li>No external sharing of PII; AI used only for summaries and risk hints.</li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-200">
          <h2 className="text-2xl font-semibold text-white">TS.6.3 – Integrate AI tools</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Donor summaries and retention risk signals surfaced in donor views.</li>
            <li>Prompts crafted to request summaries/suggestions, not decisions.</li>
          </ul>
        </section>

        <section className="space-y-3 text-gray-200">
          <h2 className="text-2xl font-semibold text-white">CCC.1.4 – Test and improve a solution</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Testing capture: <a className="text-blue-400 underline" href="/testing">/testing</a> – record user sessions, export JSON.</li>
            <li>Use saved entries to identify pain points and prioritize revisions.</li>
            <li>Reflection on improvements: <a className="text-blue-400 underline" href="/reflection">/reflection</a>.</li>
          </ul>
        </section>
      </div>
    </ProtectedGate>
  )
}
