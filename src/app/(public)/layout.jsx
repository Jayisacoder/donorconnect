/**
 * Public Layout - For donor-facing pages
 * No authentication required
 */

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Public Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">DonorConnect</h1>
              <p className="text-sm text-gray-600">Making a difference together</p>
            </div>
            <nav className="flex gap-4">
              <a href="/donate" className="text-gray-700 hover:text-primary transition-colors">
                Donate
              </a>
              <a href="/login" className="text-gray-700 hover:text-primary transition-colors">
                Staff Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-sm text-gray-400">
                DonorConnect helps nonprofits manage donor relationships and track contributions.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Contact</h3>
              <p className="text-sm text-gray-400">
                Email: support@donorconnect.org<br />
                Phone: (555) 123-4567
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Secure Giving</h3>
              <p className="text-sm text-gray-400">
                All donations are processed securely. Your information is protected.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2025 DonorConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
