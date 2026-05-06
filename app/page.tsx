'use client'

import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignalCard } from '@/components/buxhat/SignalCard'
import { MetricCard } from '@/components/buxhat/MetricCard'
import { TrendChart } from '@/components/buxhat/TrendChart'
import { Flame, Heart, Menu, Search as SearchIcon, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { artists, favorites, trendData, trendingNow, breakoutRadarRows, artistAnalyticsById } from '@/lib/mock-data'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('discover')
  const [query, setQuery] = useState('')

  const summaryMetrics = {
    totalTrends: trendingNow.length,
    topSentiment: 94,
    avgMomentum: 42,
  }

  const favoriteArtists = artists.filter((a) => favorites.some((f) => f.id === a.id))
  const favoriteCount = favoriteArtists.length
  const favoriteStreams = favoriteArtists.reduce((sum, a) => sum + a.monthlyStreams, 0)
  const favoriteFollowers = favoriteArtists.reduce((sum, a) => sum + a.followers, 0)

  const discoverFeedItems = useMemo(() => {
    const now = Date.now()
    const topRows = breakoutRadarRows
      .slice()
      .sort((a, b) => b.breakoutProbability - a.breakoutProbability)
      .slice(0, 6)

    return topRows.map((row, idx) => {
      const artist = artists.find((a) => a.id === row.artistId)
      const a = artist ? artistAnalyticsById[artist.id] : undefined
      return {
        id: `${row.artistId}-${idx}`,
        tsLabel: idx === 0 ? '47m' : idx === 1 ? '1h' : idx === 2 ? '3h' : 'Today',
        artist,
        row,
        analytics: a,
        // extra feed-only signals
        socialMentionsGrowth: Math.min(99, row.mentionsVelocity + 12),
        socialVelocity: row.mentionsVelocity,
        fanSentimentScore: Math.min(99, (a?.sentimentMomentum ?? 60) + 18),
        sentimentMomentum: a?.sentimentMomentum ?? 60,
        tiktokAudioUsageGrowth: row.tiktokUsageGrowth,
        shazamSearchSpikes: row.shazamSpikeLevel,
        playlistVelocity: row.playlistGrowth,
        streamingVelocity: Math.min(99, (artist?.breakoutPotential ?? 70)),
        anomalyDetectionSpikes: Math.max(0, Math.round((row.shazamSpikeLevel + row.tiktokUsageGrowth) / 20) - 1),
      }
    })
  }, [])

  const topTrendHighlights = useMemo(() => {
    return artists
      .map((a) => ({
        artist: a,
        analytics: artistAnalyticsById[a.id] || {
          trendScore: a.breakoutPotential,
          breakoutProbability: a.breakoutPotential,
          mentionsVelocity: a.trendChange * 2,
          sentimentMomentum: 60,
          tiktokUsageGrowth: 30,
          playlistGrowth: 30,
          forecastGrowth: 40,
        },
      }))
      .sort((x, y) => y.analytics.trendScore - x.analytics.trendScore)
      .slice(0, 10)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:ml-72">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 pb-28 lg:pb-8">
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-md border-b border-border flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <div className="w-9 h-9 bg-gradient-to-br from-signal-cyan via-signal-purple to-signal-blue rounded-xl flex items-center justify-center shadow-lg shadow-signal-purple/15">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold tracking-wide">BUXHAT</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full border border-border bg-card/60 text-muted-foreground">
                BETA
              </span>
            </div>

            <Button variant="outline" size="sm" className="h-10 rounded-xl">
              Log in
            </Button>
          </div>

          {/* Search bar (hide on small mobile to match reference) */}
          <div className="relative hidden sm:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-12 pl-12 rounded-2xl bg-card/80 border-border backdrop-blur"
            />
          </div>

          <Card className="bg-card/60 backdrop-blur border-border py-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-border rounded-none p-0 h-12">
                <TabsTrigger
                  value="discover"
                  className="relative gap-2 rounded-none data-[state=active]:bg-transparent after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  <Flame className="w-4 h-4 hidden sm:block" />
                  Discover
                </TabsTrigger>
                <TabsTrigger
                  value="highlights"
                  className="relative gap-2 rounded-none data-[state=active]:bg-transparent after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  <TrendingUp className="w-4 h-4 hidden sm:block" />
                  Trend Highlights
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="relative gap-2 rounded-none data-[state=active]:bg-transparent after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  <Heart className="w-4 h-4 hidden sm:block" />
                  My Favorites
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="mt-0 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-muted-foreground">Discover feed</h2>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>

                {/* Breakout Radar alert card */}
                {(() => {
                  const top = breakoutRadarRows.slice().sort((a, b) => b.breakoutProbability - a.breakoutProbability)[0]
                  const artist = artists.find((a) => a.id === top?.artistId)
                  if (!top || !artist) return null
                  return (
                    <div className="rounded-2xl border border-border bg-background/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">Breakout Radar Alert</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {artist.name} • strong early viral signals
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">Breakout</p>
                          <p className="text-lg font-bold text-signal-cyan">{top.breakoutProbability}%</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">TikTok growth</p>
                          <p className="font-semibold">{top.tiktokUsageGrowth}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">Shazam spikes</p>
                          <p className="font-semibold">{top.shazamSpikeLevel}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">Mentions velocity</p>
                          <p className="font-semibold">{top.mentionsVelocity}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">Playlist growth</p>
                          <p className="font-semibold">{top.playlistGrowth}%</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link href={`/scout?tab=radar&a=${artist.id}`}>
                          <Button size="sm" className="rounded-xl">
                            Open in Trend Predictor
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })()}

                {/* Real-time scout reports / signal alerts */}
                <div className="space-y-3">
                  {discoverFeedItems.map((item) => {
                    if (!item.artist) return null
                    const a = item.analytics
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-border bg-background/40 p-4 hover:bg-muted/15 transition"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.artist.image}
                              alt={item.artist.name}
                              className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{item.artist.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.artist.country} • {item.artist.genre[0]}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{item.tsLabel}</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Social mentions growth</p>
                            <p className="font-semibold">{item.socialMentionsGrowth}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Social velocity</p>
                            <p className="font-semibold">{item.socialVelocity}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Fan sentiment score</p>
                            <p className="font-semibold">{item.fanSentimentScore}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Sentiment momentum</p>
                            <p className="font-semibold">{item.sentimentMomentum}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">TikTok usage growth</p>
                            <p className="font-semibold">{item.tiktokAudioUsageGrowth}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Shazam spikes</p>
                            <p className="font-semibold">{item.shazamSearchSpikes}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Playlist velocity</p>
                            <p className="font-semibold">{item.playlistVelocity}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3">
                            <p className="text-[11px] text-muted-foreground">Streaming velocity</p>
                            <p className="font-semibold">{item.streamingVelocity}%</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/10 p-3 col-span-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] text-muted-foreground">Anomaly spikes</p>
                              <p className="font-semibold">{item.anomalyDetectionSpikes}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Breakout probability: <span className="text-foreground font-semibold">{item.row.breakoutProbability}%</span>
                          </p>
                          <Link href={`/artist/${item.artist.id}`} className="text-xs font-semibold text-signal-cyan">
                            Open analytics
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="highlights" className="mt-0 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-muted-foreground">Trend highlights</h2>
                  <span className="text-xs text-muted-foreground">Top 10</span>
                </div>

                <div className="space-y-3">
                  {topTrendHighlights.map(({ artist, analytics }, idx) => (
                    <div key={artist.id} className="rounded-2xl border border-border bg-background/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {idx + 1}. {artist.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {artist.country} • {artist.genre[0]}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[11px] text-muted-foreground">Trend Score</p>
                          <p className="text-lg font-bold text-signal-purple">{analytics.trendScore}%</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">Mentions velocity</p>
                          <p className="font-semibold">{analytics.mentionsVelocity}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">Sentiment momentum</p>
                          <p className="font-semibold">{analytics.sentimentMomentum}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">TikTok usage growth</p>
                          <p className="font-semibold">{analytics.tiktokUsageGrowth}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3">
                          <p className="text-[11px] text-muted-foreground">Playlist growth</p>
                          <p className="font-semibold">{analytics.playlistGrowth}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/10 p-3 col-span-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-muted-foreground">Breakout Probability</p>
                            <p className="font-semibold">{analytics.breakoutProbability}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link href={`/artist/${artist.id}`} className="text-xs font-semibold text-signal-cyan">
                          Open analytics
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="mt-0 p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCard title="Saved artists" value={favoriteCount} variant="cyan" />
                  <MetricCard
                    title="Monthly streams"
                    value={`${(favoriteStreams / 1_000_000).toFixed(0)}M`}
                    variant="purple"
                  />
                  <MetricCard
                    title="Followers"
                    value={`${(favoriteFollowers / 1_000_000).toFixed(1)}M`}
                    variant="orange"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-muted-foreground">Your watchlist</h2>
                    <span className="text-xs text-muted-foreground">{favoriteCount} total</span>
                  </div>

                  {favoriteCount === 0 ? (
                    <div className="mt-3 rounded-2xl border border-border bg-background/40 p-6 text-center">
                      <p className="font-semibold">No favorites yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add artists to your favorites to track them here.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {favoriteArtists.map((artist) => {
                        const a = artistAnalyticsById[artist.id]
                        const radar = breakoutRadarRows.find((r) => r.artistId === artist.id)
                        const spikeCount =
                          radar ? Math.max(0, Math.round((radar.shazamSpikeLevel + radar.tiktokUsageGrowth) / 20) - 1) : 0

                        const signals = [
                          radar?.mentionsVelocity ? `Mentions +${radar.mentionsVelocity}%` : null,
                          a?.sentimentMomentum ? `Sentiment +${a.sentimentMomentum}%` : null,
                          radar?.tiktokUsageGrowth ? `TikTok +${radar.tiktokUsageGrowth}%` : null,
                          radar?.playlistGrowth ? `Playlist +${radar.playlistGrowth}%` : null,
                        ].filter(Boolean).slice(0, 3) as string[]

                        const spikeAlerts = [
                          spikeCount > 0 ? `${spikeCount} anomaly spike${spikeCount === 1 ? '' : 's'}` : null,
                          radar?.shazamSpikeLevel && radar.shazamSpikeLevel >= 50 ? 'Shazam spike' : null,
                        ].filter(Boolean) as string[]

                        return (
                          <Link
                            key={artist.id}
                            href={`/artist/${artist.id}`}
                            className="block rounded-2xl border border-border bg-background/40 p-4 hover:bg-muted/15 transition"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={artist.image}
                                  alt={artist.name}
                                  className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                                  loading="lazy"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold truncate">{artist.name}</p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    Rank #{artist.trendingRank} • {artist.country}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-[11px] text-muted-foreground">Trend Score</p>
                                <p className="text-lg font-bold text-signal-purple">
                                  {(a?.trendScore ?? artist.breakoutPotential)}%
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="rounded-xl border border-border bg-muted/10 p-3">
                                <p className="text-[11px] text-muted-foreground">Recent signals</p>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {signals.length ? (
                                    signals.map((s) => (
                                      <span
                                        key={s}
                                        className="inline-flex items-center rounded-full border border-border bg-background/40 px-2 py-1 text-[11px] text-muted-foreground"
                                      >
                                        {s}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </div>
                              </div>

                              <div className="rounded-xl border border-border bg-muted/10 p-3">
                                <p className="text-[11px] text-muted-foreground">Spike alerts</p>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {spikeAlerts.length ? (
                                    spikeAlerts.map((s) => (
                                      <span
                                        key={s}
                                        className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2 py-1 text-[11px] text-destructive"
                                      >
                                        {s}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">None</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Mobile fixed CTA above bottom nav */}
          <div className="lg:hidden fixed left-0 right-0 bottom-16 z-10 px-4">
            <Button className="w-full h-12 rounded-2xl font-semibold shadow-lg shadow-yellow-500/10">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
