import { Suspense } from 'react'
import ScoutClient from './ScoutClient'

export default function ScoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="lg:ml-72">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6">
                <p className="font-semibold">Loading Scout…</p>
                <p className="text-sm text-muted-foreground mt-1">Preparing analytics dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ScoutClient />
    </Suspense>
  )
}
