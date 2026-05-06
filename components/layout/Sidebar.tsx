'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Compass, Home, Bell, PlayCircle, Search, User, Zap } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Explore', icon: Search },
  { href: '/scout', label: 'Scout', icon: Compass },
  { href: '/play', label: 'Play', icon: PlayCircle },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 h-screen border-r border-border bg-background/80 backdrop-blur-md flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-signal-cyan via-signal-purple to-signal-blue rounded-xl flex items-center justify-center shadow-lg shadow-signal-purple/15">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <h1 className="text-xl font-bold bg">
            BuxHat
          </h1>
          <p className="text-xs text-muted-foreground">BETA</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`interactive flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-muted/40 text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3">
        <Button className="w-full h-10 rounded-xl font-semibold" variant="default">
          Sign up
        </Button>
        <Button className="w-full h-10 rounded-xl" variant="outline">
          Log in
        </Button>

        <div className="pt-3 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground">© 2026 BuxHat</p>
        </div>
      </div>
    </aside>
  )
}
