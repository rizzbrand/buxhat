'use client'

import { useMemo, useState } from 'react'
import { Compass, Download, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MetricCard } from '@/components/buxhat/MetricCard'
import { TrendChart } from '@/components/buxhat/TrendChart'
import { BreakoutRadar } from '@/components/buxhat/BreakoutRadar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trendData, breakoutArtists, chartDataComparison, artists } from '@/lib/mock-data'

export default function ScoutPage() {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [genre, setGenre] = useState<'all' | 'Afrobeats' | 'Amapiano' | 'Hip-hop' | 'Reggae'>('all')
  const [region, setRegion] = useState<'all' | 'west' | 'south' | 'east'>('all')
  const [query, setQuery] = useState('')

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
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.genre.some((g) => g.toLowerCase().includes(q))

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
    filteredArtists.reduce((sum, a) => sum + a.breakoutPotential, 0) /
      Math.max(1, filteredArtists.length)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar Offset */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-signal-purple/10 border border-signal-purple/20 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-signal-purple" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold leading-tight">Scout</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advanced analytics and trend discovery
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-background/80 backdrop-blur-md border-b border-border sm:sticky sm:top-[96px] z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Time Period
                </label>
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
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Genre
                </label>
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
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Region
                </label>
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
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Search
                </label>
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
                {filteredArtists.length === 1 ? '' : 's'} for <span className="text-foreground font-semibold">{timePeriod}</span>
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
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Trending Artists"
              value={trendingCount}
              change={5}
              variant="purple"
            />
            <MetricCard
              title="Avg. Breakout Potential"
              value={`${avgBreakoutPotential}%`}
              change={8}
              variant="cyan"
            />
            <MetricCard
              title="Market Momentum"
              value="92%"
              change={12}
              variant="blue"
            />
            <MetricCard
              title="New Trending"
              value="3"
              subtitle="This week"
              variant="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trend Analysis */}
            <TrendChart
              data={trendData}
              dataKeys={['streams']}
              title="Streaming Trends (12 Months)"
              type="area"
              colors={['#a855f7']}
              height={350}
            />

            {/* Multi-Artist Comparison */}
            <TrendChart
              data={chartDataComparison}
              dataKeys={['Wizkid', 'Burna Boy', 'CKay', 'Davido']}
              title="Top Artists Comparison"
              type="line"
              colors={['#a855f7', '#06b6d4', '#f97316', '#8b5cf6']}
              height={350}
            />
          </div>

          {/* Breakout Radar */}
          <BreakoutRadar data={breakoutArtists} title="Breakout Potential Radar" height={400} />

          {/* Rising Artists Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Rising Artists</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Filtered by your current scout settings.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredArtists.length} result{filteredArtists.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            {filteredArtists.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-foreground font-semibold">No matches</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try clearing filters or searching a different artist/genre.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile list */}
                <div className="md:hidden divide-y divide-border">
                  {filteredArtists.map((artist) => (
                    <div key={artist.id} className="p-4">
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
                            artist.trendChange >= 0
                              ? 'bg-signal-green/15 text-signal-green'
                              : 'bg-destructive/15 text-destructive'
                          }`}
                        >
                          {artist.trendChange >= 0 ? '+' : ''}
                          {artist.trendChange}%
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-muted/20 border border-border px-3 py-2">
                          <p className="text-[11px] text-muted-foreground">Monthly streams</p>
                          <p className="text-sm font-semibold mt-0.5">
                            {(artist.monthlyStreams / 1_000_000).toFixed(1)}M
                          </p>
                        </div>
                        <div className="rounded-md bg-muted/20 border border-border px-3 py-2">
                          <p className="text-[11px] text-muted-foreground">Breakout potential</p>
                          <p className="text-sm font-semibold mt-0.5">{artist.breakoutPotential}%</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-signal-purple to-signal-cyan"
                            style={{ width: `${artist.breakoutPotential}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {artist.breakoutPotential}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Artist
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Country
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Genre
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Streams (Monthly)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Change
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Potential
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArtists.map((artist) => (
                        <tr key={artist.id} className="border-b border-border hover:bg-muted/40 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={artist.image}
                                alt={artist.name}
                                className="h-9 w-9 rounded-full object-cover border border-border bg-muted shrink-0"
                                loading="lazy"
                              />
                              <span className="font-semibold truncate">{artist.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {artist.country}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {artist.genre[0]}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(artist.monthlyStreams / 1_000_000).toFixed(1)}M
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                artist.trendChange >= 0
                                  ? 'bg-signal-green/15 text-signal-green'
                                  : 'bg-destructive/15 text-destructive'
                              }`}
                            >
                              {artist.trendChange >= 0 ? '+' : ''}
                              {artist.trendChange}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-signal-purple to-signal-cyan h-full rounded-full"
                                  style={{ width: `${artist.breakoutPotential}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold">{artist.breakoutPotential}%</span>
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
        </div>
      </div>
    </div>
  )
}
