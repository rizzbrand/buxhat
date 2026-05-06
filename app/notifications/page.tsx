import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="lg:ml-72">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          <p className="text-muted-foreground">
            Coming soon — alerts for breakouts, spikes, and watchlist changes.
          </p>

          {/* <div className="mt-8 rounded-2xl border border-border bg-card/60 backdrop-blur p-6">
            <p className="font-semibold">Example alerts</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>- “Rema up +18% this week”</li>
              <li>- “Amapiano Collective breakout potential crossed 90%”</li>
              <li>- “New trending artist in your favorite genres”</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}

