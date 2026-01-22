import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Problem | DonorConnect' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Public Header */}
      <header className="bg-slate-900/50 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="hover:opacity-80 transition">
                <h1 className="text-2xl font-bold text-purple-400">DonorConnect</h1>
                <p className="text-sm text-gray-400">Making a difference together</p>
              </Link>
            </div>
            <nav className="flex gap-4 items-center">
              <Link href="/about">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">About</Button>
              </Link>
              <Link href="/why-donorconnect">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">Why DonorConnect</Button>
              </Link>
              <Link href="/donate">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/20">Donate</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-slate-950 text-white border border-purple-500/50 hover:bg-purple-500/20">Staff Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">The Nonprofit Donor Problem</h1>
          <p className="text-lg text-gray-300">Nonprofits lose most first-time donors before a second gift. Disconnected data, manual follow-ups, and limited staff time create missed touchpoints that erode trust.</p>
          <div className="space-y-4 text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-white">Why it matters</h2>
              <p>Retention drives sustainability. Each lost donor increases acquisition costs and shrinks reliable revenue, forcing nonprofits to spend more time fundraising than serving their mission.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white">Who is affected</h2>
              <p>Development teams, program leads, and donors themselves. Staff lack timely signals; donors feel unseen; leadership loses predictable cash flow.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white">Consequences of inaction</h2>
              <p>Lower renewal rates, smaller average gifts, and reduced program impact. Without timely outreach, first gifts never turn into relationships.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white">How DonorConnect differs</h2>
              <p>We pair multi-tenant donor/donation tracking with AI summaries and retention risk signals, helping small teams act quickly without heavy CRMs.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
