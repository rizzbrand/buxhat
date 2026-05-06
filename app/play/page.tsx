import { PlayCircle } from 'lucide-react'

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="lg:ml-72">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Play</h1>
          </div>
          <p className="text-muted-foreground">
            Coming soon — a space for playlists, previews, and trend-based discovery.
          </p>

          {/* <div className="mt-8 rounded-2xl border border-border bg-card/60 backdrop-blur p-6">
            <p className="font-semibold">What you’ll get here</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>- Curated “rising now” playlists</li>
              <li>- Audio previews and share links</li>
              <li>- Saved queues from your favorites</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}

