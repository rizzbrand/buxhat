'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Search, User, Zap } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/scout', label: 'Scout', icon: Compass },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r border-border bg-background flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-signal-cyan via-signal-purple to-signal-blue rounded-lg flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-signal-cyan to-signal-purple bg-clip-text text-transparent">BuxHat</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`interactive flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-signal-cyan/10 border border-signal-cyan/30 text-signal-cyan font-semibold shadow-lg shadow-signal-cyan/10'
                  : 'text-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          African Music Intelligence Platform
        </p>
      </div>
    </aside>
  )
}
