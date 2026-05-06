'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden border-t border-border">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
