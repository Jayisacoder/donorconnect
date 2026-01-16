'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  Gift, 
  TrendingUp, 
  CheckSquare, 
  FolderTree, 
  Workflow,
  LogOut,
  User,
  Zap
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Donations', href: '/donations', icon: Gift },
  { name: 'Simulate', href: '/donations/simulate', icon: Zap },
  { name: 'Campaigns', href: '/campaigns', icon: TrendingUp },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Segments', href: '/segments', icon: FolderTree },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
]

export function Sidebar({ user }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gradient-to-b from-white to-gray-50/50 shadow-lg">
      <div className="flex h-16 items-center px-6 border-b bg-gradient-to-r from-gray-900 to-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-primary font-black text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-white">DonorConnect</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-gray-700 hover:bg-muted hover:text-foreground hover:shadow-sm hover:translate-x-1"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                )} 
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive hover:shadow-sm group"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 transition-all group-hover:text-destructive group-hover:scale-110" />
          Logout
        </button>
      </div>
    </div>
  )
}
