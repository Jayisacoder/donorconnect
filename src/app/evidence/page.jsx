"use client"

import ProtectedGate from '@/components/protected-gate'
import Link from 'next/link'

export default function EvidencePage() {
  return (
    <ProtectedGate>
      <div className="mx-auto max-w-5xl space-y-10 py-12 px-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Evidence & Rubric</h1>
          <p className="mt-2 text-lg text-gray-300">
            Direct links to where each rubric criterion is implemented in the application.
          </p>
        </div>

        {/* CCC.1.3 Evidence */}
        <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded">CCC.1.3</span>
            <h2 className="text-2xl font-semibold text-white">Implement a Solution</h2>
          </div>
          <p className="text-gray-300">
            Evidence of a complete, functional solution with working features and user interface.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-900/50 rounded p-4">
              <h3 className="font-semibold text-white mb-3">📊 Core CRUD Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Dashboard with analytics</span>
                  <Link href="/dashboard" className="text-blue-400 hover:underline">/dashboard →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Donor list, add, edit, delete</span>
                  <Link href="/donors" className="text-blue-400 hover:underline">/donors →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Donation recording & tracking</span>
                  <Link href="/donations" className="text-blue-400 hover:underline">/donations →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Campaign management</span>
                  <Link href="/campaigns" className="text-blue-400 hover:underline">/campaigns →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Segment builder</span>
                  <Link href="/segments" className="text-blue-400 hover:underline">/segments →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Workflow automation</span>
                  <Link href="/workflows" className="text-blue-400 hover:underline">/workflows →</Link>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">Task management</span>
                  <Link href="/tasks" className="text-blue-400 hover:underline">/tasks →</Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 rounded p-4">
              <h3 className="font-semibold text-white mb-3">🔐 Authentication & Multi-Tenancy</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">User login</span>
                  <Link href="/login" className="text-blue-400 hover:underline">/login →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Organization registration</span>
                  <Link href="/register" className="text-blue-400 hover:underline">/register →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Public org directory</span>
                  <Link href="/organizations" className="text-blue-400 hover:underline">/organizations →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Public org page (example)</span>
                  <Link href="/org/hope-foundation" className="text-blue-400 hover:underline">/org/hope-foundation →</Link>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">Public donation page</span>
                  <Link href="/org/hope-foundation/donate" className="text-blue-400 hover:underline">/org/.../donate →</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded p-4">
            <h3 className="font-semibold text-white mb-3">🔗 External Links</h3>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/LaunchPadPhilly/donorconnect-bc2-Jayisacoder" 
                 className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition">
                <span>📂</span> GitHub Repository
              </a>
              <a href="https://donorconnect.vercel.app" 
                 className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition">
                <span>🌐</span> Live Vercel Deployment
              </a>
            </div>
          </div>
        </section>

        {/* TS.6.2 Evidence */}
        <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded">TS.6.2</span>
            <h2 className="text-2xl font-semibold text-white">Use AI Responsibly</h2>
          </div>
          <p className="text-gray-300">
            Evidence of responsible AI integration with proper safeguards, privacy considerations, and ethical usage.
          </p>
          
          <div className="bg-gray-900/50 rounded p-4 space-y-4">
            <h3 className="font-semibold text-white">AI Policy & Documentation</h3>
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div>
                <p className="text-white font-medium">Comprehensive AI Policy Page</p>
                <p className="text-gray-400 text-sm">Model info, data handling, prompt engineering, safeguards</p>
              </div>
              <Link href="/ai-policy" className="text-blue-400 hover:underline">/ai-policy →</Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-900/50 rounded p-4">
              <h3 className="font-semibold text-white mb-3">🛡️ Responsible AI Practices</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>API keys stored server-side only (never exposed to client)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Organization scoping validated before AI calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Minimal data sent (aggregates, not raw PII)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>User opt-in required (button click)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>AI provides suggestions, not decisions</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded p-4">
              <h3 className="font-semibold text-white mb-3">🔒 Security Implementation</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>HTTP-only session cookies (not localStorage)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>bcrypt password hashing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Role-based access control (Admin/Staff/Marketing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>All queries filtered by organizationId</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Protected routes via middleware + layout guards</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded p-4">
            <h3 className="font-semibold text-white mb-2">📍 Code Location</h3>
            <p className="text-gray-400 text-sm mb-2">AI summarization endpoint with all safeguards:</p>
            <code className="block bg-gray-800 text-green-400 px-3 py-2 rounded text-sm">
              src/app/api/ai/summarize-donor/route.js
            </code>
          </div>
        </section>

        {/* TS.6.3 Evidence */}
        <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded">TS.6.3</span>
            <h2 className="text-2xl font-semibold text-white">Integrate AI Tools</h2>
          </div>
          <p className="text-gray-300">
            Evidence of meaningful AI integration that improves the solution's functionality.
          </p>
          
          <div className="bg-gray-900/50 rounded p-4 space-y-4">
            <h3 className="font-semibold text-white">🤖 AI Donor Summary Feature</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-3 border border-gray-700 rounded">
                <p className="text-3xl font-bold text-purple-400">GPT-4o-mini</p>
                <p className="text-gray-400 text-sm">AI Model</p>
              </div>
              <div className="text-center p-3 border border-gray-700 rounded">
                <p className="text-3xl font-bold text-purple-400">80-100</p>
                <p className="text-gray-400 text-sm">Words per summary</p>
              </div>
              <div className="text-center p-3 border border-gray-700 rounded">
                <p className="text-3xl font-bold text-purple-400">1-click</p>
                <p className="text-gray-400 text-sm">User activation</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded p-4">
            <h3 className="font-semibold text-white mb-3">📝 Prompt Engineering Approach</h3>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-400 mb-1">System Prompt:</p>
                <p className="text-blue-300 font-mono">"Be concise, factual, and actionable. Do not invent data."</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-gray-400 mb-1">User Prompt:</p>
                <p className="text-green-300 font-mono">"Summarize this donor in 80-100 words max with risk assessment and suggested next action..."</p>
              </div>
            </div>
            <div className="mt-4 text-gray-300 text-sm">
              <p><strong className="text-white">Why this approach:</strong></p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Word limit prevents verbose, unfocused responses</li>
                <li>"Do not invent data" reduces hallucination risk</li>
                <li>Low temperature (0.4) ensures consistent output</li>
                <li>Staff notes enable personalized recommendations</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded p-4">
            <h3 className="font-semibold text-white mb-3">💡 How AI Improves the Solution</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-gray-700 rounded p-3">
                <p className="text-red-400 font-medium mb-2">Without AI</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Staff manually reviews donor history</li>
                  <li>• Risk assessment is subjective</li>
                  <li>• Outreach personalization takes time</li>
                </ul>
              </div>
              <div className="border border-green-700 rounded p-3">
                <p className="text-green-400 font-medium mb-2">With AI</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Instant donor summary in one click</li>
                  <li>• Consistent, data-driven risk assessment</li>
                  <li>• AI suggests specific next actions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CCC.1.4 Evidence */}
        <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-teal-600 text-white text-sm font-bold px-3 py-1 rounded">CCC.1.4</span>
            <h2 className="text-2xl font-semibold text-white">Test and Improve a Solution</h2>
          </div>
          <p className="text-gray-300">
            Evidence of testing methodology, user feedback collection, and iterative improvements.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-900/50 rounded p-4">
              <h3 className="font-semibold text-white mb-3">🧪 Testing Infrastructure</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">User testing capture</span>
                  <Link href="/testing" className="text-blue-400 hover:underline">/testing →</Link>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Unit tests (Vitest)</span>
                  <span className="text-gray-400 text-xs">pnpm test</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-300">Integration tests</span>
                  <span className="text-gray-400 text-xs">tests/integration/</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">E2E tests (Playwright)</span>
                  <span className="text-gray-400 text-xs">pnpm test:e2e</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded p-4">
              <h3 className="font-semibold text-white mb-3">📈 Improvement Process</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">1.</span>
                  <span>Collect user feedback via testing page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">2.</span>
                  <span>Export JSON data for analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">3.</span>
                  <span>Identify pain points and priorities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">4.</span>
                  <span>Implement fixes and enhancements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">5.</span>
                  <span>Document learnings in reflection</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded p-4">
            <h3 className="font-semibold text-white mb-2">📝 Reflection & Learnings</h3>
            <p className="text-gray-400 text-sm mb-2">Documentation of challenges, improvements, and growth:</p>
            <Link href="/reflection" className="inline-flex items-center gap-2 text-blue-400 hover:underline">
              View Project Reflection → /reflection
            </Link>
          </div>
        </section>

        {/* Quick Links Summary */}
        <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🔗 Quick Access</h2>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/LaunchPadPhilly/donorconnect-bc2-Jayisacoder" 
               className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition">
              GitHub Repository
            </a>
            <a href="https://donorconnect.vercel.app" 
               className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-sm transition">
              Vercel Deployment
            </a>
            <Link href="/ai-policy" className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm transition">
              AI Policy
            </Link>
            <Link href="/reflection" className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition">
              Reflection
            </Link>
            <Link href="/testing" className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm transition">
              Testing
            </Link>
          </div>
        </section>
      </div>
    </ProtectedGate>
  )
}
