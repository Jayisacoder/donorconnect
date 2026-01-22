/**
 * Public Layout - For donor-facing pages
 * No authentication required
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex flex-col">
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
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-purple-500/20 text-gray-400">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-2 text-white">About</h3>
              <p className="text-sm">
                DonorConnect helps nonprofits manage donor relationships and track contributions.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-white">Contact</h3>
              <p className="text-sm">
                Email: support@donorconnect.org<br />
                Phone: (555) 123-4567
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-white">Secure Giving</h3>
              <p className="text-sm">
                All donations are processed securely. Your information is protected.
              </p>
            </div>
          </div>
          <div className="border-t border-purple-500/20 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2025 DonorConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
