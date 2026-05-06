'use client'

import { useMemo, useState } from 'react'
import { Compass, Download, Menu, SlidersHorizontal, Zap } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricCard } from '@/components/buxhat/MetricCard'
import { TrendChart } from '@/components/buxhat/TrendChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { scoutTrendCharts, breakoutRadarRows, artistAnalyticsById, artists } from '@/lib/mock-data'

export default function ScoutClient() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as 'trends' | 'radar' | 'compare' | null) || 'trends'
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [genre, setGenre] = useState<'all' | 'Afrobeats' | 'Amapiano' | 'Hip-hop' | 'Reggae'>('all')
  const [region, setRegion] = useState<'all' | 'west' | 'south' | 'east'>('all')
  const [query, setQuery] = useState('')
  const [compareA, setCompareA] = useState<string>(() => searchParams.get('a') || artists[0]?.id || '1')
  const [compareB, setCompareB] = useState<string>(() => searchParams.get('b') || artists[1]?.id || '2')
  const [activeTab, setActiveTab] = useState<'trends' | 'radar' | 'compare'>(initialTab)

  const regionCountries = useMemo(() => {
    return {
      west: new Set(['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Côte d’Ivoire']),
      south: new Set(['South Africa']),
      east: new Set(['Kenya', 'Tanzania', 'Uganda', 'Ethiopia']),
    } as const
  }, [])

  const filteredArtists = useMemo(() => {
    const q = query.trim().toLowerCase()
    return artists.filter((a) => {
      const matchesQuery = !q || a.name.toLowerCase().includes(q) || a.genre.some((g) => g.toLowerCase().includes(q))

      const matchesGenre = genre === 'all' || a.genre.includes(genre)

      const matchesRegion =
        region === 'all' ||
        (region === 'west' && regionCountries.west.has(a.country)) ||
        (region === 'south' && regionCountries.south.has(a.country)) ||
        (region === 'east' && regionCountries.east.has(a.country))

      return matchesQuery && matchesGenre && matchesRegion
    })
  }, [genre, query, region, regionCountries])

  const trendingCount = filteredArtists.length
  const avgBreakoutPotential = Math.round(
    breakoutRadarRows.reduce((sum, r) => sum + r.breakoutProbability, 0) / Math.max(1, breakoutRadarRows.length)
  )

  const selectedA = artists.find((a) => a.id === compareA) || artists[0]
  const selectedB = artists.find((a) => a.id === compareB) || artists[1] || artists[0]
  const analyticsA = artistAnalyticsById[selectedA?.id] || artistAnalyticsById['1']
  const analyticsB = artistAnalyticsById[selectedB?.id] || artistAnalyticsById['2']

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:ml-72">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
          {/* Mobile top bar (same vibe as Home) */}
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

          {/* Panel */}
          <Card className="bg-card/60 backdrop-blur border-border py-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-border rounded-none p-0 h-12">
                <TabsTrigger
                  value="trends"
                  className="relative rounded-none data-[state=active]:bg-transparent after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Trend Charts
                </TabsTrigger>
                <TabsTrigger
                  value="radar"
                  className="relative rounded-none data-[state=active]:bg-transparent after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Breakout Radar
                </TabsTrigger>
                <TabsTrigger
                  value="compare"
                  className="relative rounded-none data-[state=active]:bg-transparent after:content-[''] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Compare
                </TabsTrigger>
              </TabsList>

              {/* Filters row */}
              <div className="p-5 border-b border-border space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
                      <Compass className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-bold">Scout</p>
                      <p className="text-xs text-muted-foreground">Advanced analytics</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Time Period</label>
                    <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as typeof timePeriod)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="quarter">Last 90 Days</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Genre</label>
                    <Select value={genre} onValueChange={(v) => setGenre(v as typeof genre)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        <SelectItem value="Afrobeats">Afrobeats</SelectItem>
                        <SelectItem value="Amapiano">Amapiano</SelectItem>
                        <SelectItem value="Hip-hop">Hip-Hop</SelectItem>
                        <SelectItem value="Reggae">Reggae</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Region</label>
                    <Select value={region} onValueChange={(v) => setRegion(v as typeof region)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Africa</SelectItem>
                        <SelectItem value="west">West Africa</SelectItem>
                        <SelectItem value="south">South Africa</SelectItem>
                        <SelectItem value="east">East Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Search</label>
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search artists or genres…"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="text-foreground font-semibold">{filteredArtists.length}</span> artist
                    {filteredArtists.length === 1 ? '' : 's'} for{' '}
                    <span className="text-foreground font-semibold">{timePeriod}</span>
                  </p>
                  {(query || genre !== 'all' || region !== 'all') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery('')
                        setGenre('all')
                        setRegion('all')
                        setTimePeriod('month')
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>

                {/* Summary metrics (restored) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <MetricCard title="Trending" value={trendingCount} variant="purple" />
                  <MetricCard title="Avg breakout" value={`${avgBreakoutPotential}%`} variant="cyan" />
                  <MetricCard title="Momentum" value="92%" change={12} variant="blue" />
                  <MetricCard title="New" value="3" subtitle="This week" variant="orange" />
                </div>
              </div>

              <TabsContent value="trends" className="mt-0 p-5 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <TrendChart
                    data={scoutTrendCharts}
                    dataKeys={['mentionsGrowth']}
                    title="Mentions growth"
                    type="area"
                    colors={['#06b6d4']}
                    height={280}
                  />
                  <TrendChart
                    data={scoutTrendCharts}
                    dataKeys={['sentimentMomentum']}
                    title="Sentiment momentum"
                    type="line"
                    colors={['#a855f7']}
                    height={280}
                  />
                  <TrendChart
                    data={scoutTrendCharts}
                    dataKeys={['tiktokUsage']}
                    title="TikTok audio usage"
                    type="area"
                    colors={['#f97316']}
                    height={280}
                  />
                  <TrendChart
                    data={scoutTrendCharts}
                    dataKeys={['anomalySpikes']}
                    title="Anomaly spikes"
                    type="line"
                    colors={['#ef4444']}
                    height={280}
                  />
                  <TrendChart
                    data={scoutTrendCharts}
                    dataKeys={['forecastGrowth']}
                    title="Forecast growth"
                    type="area"
                    colors={['#10b981']}
                    height={280}
                  />
                </div>
              </TabsContent>

              <TabsContent value="radar" className="mt-0 p-0">
                <div className="p-5 border-b border-border flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">Breakout Radar</p>
                    <p className="text-sm text-muted-foreground">Emerging artists with strong breakout signals.</p>
                  </div>
                  <MetricCard title="Avg probability" value={`${avgBreakoutPotential}%`} variant="cyan" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Artist</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          TikTok usage growth
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Shazam spike level
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Mentions velocity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Playlist growth
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Breakout Probability
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakoutRadarRows.map((row) => {
                        const artist = artists.find((a) => a.id === row.artistId)
                        if (!artist) return null
                        return (
                          <tr key={row.artistId} className="border-b border-border hover:bg-muted/30 transition">
                            <td className="px-4 py-3">
                              <Link href={`/artist/${artist.id}`} className="flex items-center gap-3 min-w-0">
                                <img
                                  src={artist.image}
                                  alt={artist.name}
                                  className="h-9 w-9 rounded-full object-cover border border-border bg-muted shrink-0"
                                  loading="lazy"
                                />
                                <span className="font-semibold truncate">{artist.name}</span>
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-sm">{row.tiktokUsageGrowth}%</td>
                            <td className="px-4 py-3 text-sm">{row.shazamSpikeLevel}%</td>
                            <td className="px-4 py-3 text-sm">{row.mentionsVelocity}%</td>
                            <td className="px-4 py-3 text-sm">{row.playlistGrowth}%</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-signal-purple to-signal-cyan h-full rounded-full"
                                    style={{ width: `${row.breakoutProbability}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold">{row.breakoutProbability}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Rising artists (restored) */}
                <div className="p-5 border-t border-border">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">Rising Artists</p>
                      <p className="text-sm text-muted-foreground">Filtered by your current scout settings.</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {filteredArtists.length} result{filteredArtists.length === 1 ? '' : 's'}
                    </p>
                  </div>

                  {filteredArtists.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-border bg-background/40 p-6 text-center">
                      <p className="font-semibold">No matches</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try clearing filters or searching a different artist/genre.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile list */}
                      <div className="mt-4 md:hidden divide-y divide-border rounded-2xl border border-border overflow-hidden bg-background/20">
                        {filteredArtists.map((artist) => (
                          <Link key={artist.id} href={`/artist/${artist.id}`} className="block p-4 hover:bg-muted/20 transition">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={artist.image}
                                  alt={artist.name}
                                  className="h-10 w-10 rounded-full object-cover border border-border bg-muted shrink-0"
                                  loading="lazy"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold truncate">{artist.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                    {artist.country} • {artist.genre[0]}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                  artist.trendChange >= 0 ? 'bg-signal-green/15 text-signal-green' : 'bg-destructive/15 text-destructive'
                                }`}
                              >
                                {artist.trendChange >= 0 ? '+' : ''}
                                {artist.trendChange}%
                              </span>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div className="rounded-md bg-muted/20 border border-border px-3 py-2">
                                <p className="text-[11px] text-muted-foreground">Monthly streams</p>
                                <p className="text-sm font-semibold mt-0.5">{(artist.monthlyStreams / 1_000_000).toFixed(1)}M</p>
                              </div>
                              <div className="rounded-md bg-muted/20 border border-border px-3 py-2">
                                <p className="text-[11px] text-muted-foreground">Breakout probability</p>
                                <p className="text-sm font-semibold mt-0.5">
                                  {(artistAnalyticsById[artist.id]?.breakoutProbability ?? avgBreakoutPotential)}%
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden md:block mt-4 overflow-x-auto rounded-2xl border border-border bg-background/10">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Artist</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Country</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Genre</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Streams (Monthly)</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Change</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Breakout</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredArtists.map((artist) => (
                              <tr key={artist.id} className="border-b border-border hover:bg-muted/20 transition">
                                <td className="px-4 py-3">
                                  <Link href={`/artist/${artist.id}`} className="flex items-center gap-3 min-w-0">
                                    <img
                                      src={artist.image}
                                      alt={artist.name}
                                      className="h-9 w-9 rounded-full object-cover border border-border bg-muted shrink-0"
                                      loading="lazy"
                                    />
                                    <span className="font-semibold truncate">{artist.name}</span>
                                  </Link>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{artist.country}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{artist.genre[0]}</td>
                                <td className="px-4 py-3 text-sm">{(artist.monthlyStreams / 1_000_000).toFixed(1)}M</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                      artist.trendChange >= 0 ? 'bg-signal-green/15 text-signal-green' : 'bg-destructive/15 text-destructive'
                                    }`}
                                  >
                                    {artist.trendChange >= 0 ? '+' : ''}
                                    {artist.trendChange}%
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-signal-purple to-signal-cyan h-full rounded-full"
                                        style={{
                                          width: `${(artistAnalyticsById[artist.id]?.breakoutProbability ?? avgBreakoutPotential)}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-bold">
                                      {(artistAnalyticsById[artist.id]?.breakoutProbability ?? avgBreakoutPotential)}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="compare" className="mt-0 p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Artist A</label>
                    <Select value={compareA} onValueChange={setCompareA}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Artist B</label>
                    <Select value={compareB} onValueChange={setCompareB}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="card-glow p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={selectedA.image}
                        alt={selectedA.name}
                        className="h-10 w-10 rounded-full object-cover border border-border bg-muted"
                      />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{selectedA.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {selectedA.country} • {selectedA.genre[0]}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCard title="Mentions velocity" value={`${analyticsA.mentionsVelocity}%`} variant="cyan" />
                      <MetricCard title="Sentiment momentum" value={`${analyticsA.sentimentMomentum}%`} variant="purple" />
                      <MetricCard title="TikTok usage growth" value={`${analyticsA.tiktokUsageGrowth}%`} variant="orange" />
                      <MetricCard title="Playlist growth" value={`${analyticsA.playlistGrowth}%`} variant="green" />
                      <MetricCard title="Forecast growth" value={`${analyticsA.forecastGrowth}%`} variant="blue" />
                      <MetricCard title="Trend Score" value={`${analyticsA.trendScore}%`} variant="default" />
                      <MetricCard title="Breakout Probability" value={`${analyticsA.breakoutProbability}%`} variant="cyan" />
                    </div>
                  </div>

                  <div className="card-glow p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={selectedB.image}
                        alt={selectedB.name}
                        className="h-10 w-10 rounded-full object-cover border border-border bg-muted"
                      />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{selectedB.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {selectedB.country} • {selectedB.genre[0]}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCard title="Mentions velocity" value={`${analyticsB.mentionsVelocity}%`} variant="cyan" />
                      <MetricCard title="Sentiment momentum" value={`${analyticsB.sentimentMomentum}%`} variant="purple" />
                      <MetricCard title="TikTok usage growth" value={`${analyticsB.tiktokUsageGrowth}%`} variant="orange" />
                      <MetricCard title="Playlist growth" value={`${analyticsB.playlistGrowth}%`} variant="green" />
                      <MetricCard title="Forecast growth" value={`${analyticsB.forecastGrowth}%`} variant="blue" />
                      <MetricCard title="Trend Score" value={`${analyticsB.trendScore}%`} variant="default" />
                      <MetricCard title="Breakout Probability" value={`${analyticsB.breakoutProbability}%`} variant="cyan" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

