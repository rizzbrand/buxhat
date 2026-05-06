'use client'

import { useState } from 'react'
import { Menu, Search as SearchIcon, Filter, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { albums, artists, breakoutRadarRows, trendingNow, artistAnalyticsById } from '@/lib/mock-data'

const genreOptions = [
  { value: 'all', label: 'All' },
  { value: 'Afrobeats', label: 'Afrobeats' },
  { value: 'Amapiano', label: 'Amapiano' },
  { value: 'Hip-hop', label: 'Hip-Hop' },
  { value: 'Reggae', label: 'Reggae' },
  { value: 'R&B', label: 'R&B' },
] as const

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [filterGenre, setFilterGenre] = useState('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'artists' | 'songs' | 'albums'>('all')

  const showBrowseState = !searchQuery && filterGenre === 'all'

  type SearchResult =
    | {
        kind: 'artist'
        id: string
        title: string
        subtitle: string
        image: string
        href: string
        metrics: Record<string, number>
      }
    | {
        kind: 'song'
        id: string
        title: string
        subtitle: string
        image: string
        href: string
        metrics: Record<string, number>
      }
    | {
        kind: 'album'
        id: string
        title: string
        subtitle: string
        image: string
        href: string
        metrics: Record<string, number>
      }

  const q = searchQuery.trim().toLowerCase()

  const artistResults: SearchResult[] =
    typeFilter === 'songs' || typeFilter === 'albums'
      ? []
      : artists
          .filter((a) => {
            const matchesSearch =
              !q ||
              a.name.toLowerCase().includes(q) ||
              a.genre.some((g) => g.toLowerCase().includes(q))
            const matchesGenre = filterGenre === 'all' || a.genre.includes(filterGenre)
            return matchesSearch && matchesGenre
          })
          .map((a) => {
            const analytics = artistAnalyticsById[a.id]
            const radar = breakoutRadarRows.find((r) => r.artistId === a.id)
            const trendScore = analytics?.trendScore ?? a.breakoutPotential
            const breakoutProbability = analytics?.breakoutProbability ?? radar?.breakoutProbability ?? a.breakoutPotential
            return {
              kind: 'artist',
              id: a.id,
              title: a.name,
              subtitle: `${a.country} • ${a.genre[0]}`,
              image: a.image,
              href: `/artist/${a.id}`,
              metrics: {
                mentionsGrowth: Math.min(99, (radar?.mentionsVelocity ?? a.trendChange * 2) + 12),
                socialVelocity: radar?.mentionsVelocity ?? a.trendChange * 2,
                sentimentScore: Math.min(99, (analytics?.sentimentMomentum ?? 60) + 18),
                sentimentMomentum: analytics?.sentimentMomentum ?? 60,
                tiktokUsage: radar?.tiktokUsageGrowth ?? analytics?.tiktokUsageGrowth ?? 30,
                shazamSpikes: radar?.shazamSpikeLevel ?? 20,
                playlistVelocity: radar?.playlistGrowth ?? analytics?.playlistGrowth ?? 30,
                streamingVelocity: Math.min(99, a.breakoutPotential),
                breakoutProbability,
                trendScore,
              },
            }
          })

  const songResults: SearchResult[] =
    typeFilter === 'artists' || typeFilter === 'albums'
      ? []
      : trendingNow
          .filter((s) => {
            const matchesSearch =
              !q ||
              s.song.toLowerCase().includes(q) ||
              s.artist.toLowerCase().includes(q) ||
              s.genre.toLowerCase().includes(q)
            const matchesGenre = filterGenre === 'all' || s.genre === filterGenre
            return matchesSearch && matchesGenre
          })
          .map((s) => {
            const artist = artists.find((a) => a.name === s.artist)
            const radar = artist ? breakoutRadarRows.find((r) => r.artistId === artist.id) : undefined
            const analytics = artist ? artistAnalyticsById[artist.id] : undefined
            const trendScore = analytics?.trendScore ?? Math.min(99, 60 + Math.round(s.change / 2))
            const breakoutProbability = radar?.breakoutProbability ?? Math.min(99, 50 + Math.round(s.change / 2))
            return {
              kind: 'song',
              id: s.id,
              title: s.song,
              subtitle: `${s.artist} • ${s.genre}`,
              image: artist?.image ?? '/placeholder-user.jpg',
              href: artist ? `/artist/${artist.id}` : '/search',
              metrics: {
                mentionsGrowth: Math.min(99, (radar?.mentionsVelocity ?? 40) + 10),
                socialVelocity: radar?.mentionsVelocity ?? 40,
                sentimentScore: s.sentiment,
                sentimentMomentum: analytics?.sentimentMomentum ?? 60,
                tiktokUsage: radar?.tiktokUsageGrowth ?? 35,
                shazamSpikes: radar?.shazamSpikeLevel ?? 25,
                playlistVelocity: radar?.playlistGrowth ?? 30,
                streamingVelocity: Math.min(99, 60 + Math.round(s.change / 2)),
                breakoutProbability,
                trendScore,
              },
            }
          })

  const albumResults: SearchResult[] =
    typeFilter === 'artists' || typeFilter === 'songs'
      ? []
      : albums
          .filter((al) => {
            const matchesSearch =
              !q ||
              al.title.toLowerCase().includes(q) ||
              al.artist.toLowerCase().includes(q) ||
              al.genre.toLowerCase().includes(q)
            const matchesGenre = filterGenre === 'all' || al.genre === filterGenre
            return matchesSearch && matchesGenre
          })
          .map((al) => {
            const artist = artists.find((a) => a.id === al.artistId)
            const radar = artist ? breakoutRadarRows.find((r) => r.artistId === artist.id) : undefined
            const analytics = artist ? artistAnalyticsById[artist.id] : undefined
            const trendScore = analytics?.trendScore ?? Math.min(99, 65 + Math.round(al.change / 2))
            const breakoutProbability = radar?.breakoutProbability ?? Math.min(99, 55 + Math.round(al.change / 2))
            return {
              kind: 'album',
              id: al.id,
              title: al.title,
              subtitle: `${al.artist} • ${al.genre}`,
              image: al.cover,
              href: artist ? `/artist/${artist.id}` : '/search',
              metrics: {
                mentionsGrowth: Math.min(99, (radar?.mentionsVelocity ?? 38) + 8),
                socialVelocity: radar?.mentionsVelocity ?? 38,
                sentimentScore: Math.min(99, (analytics?.sentimentMomentum ?? 60) + 12),
                sentimentMomentum: analytics?.sentimentMomentum ?? 60,
                tiktokUsage: radar?.tiktokUsageGrowth ?? 30,
                shazamSpikes: radar?.shazamSpikeLevel ?? 20,
                playlistVelocity: radar?.playlistGrowth ?? 28,
                streamingVelocity: Math.min(99, 55 + Math.round(al.change / 2)),
                breakoutProbability,
                trendScore,
              },
            }
          })

  const results: SearchResult[] = [...artistResults, ...songResults, ...albumResults]

  const sortedResults = results.slice().sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.metrics.trendScore - a.metrics.trendScore
      case 'streams':
        return b.metrics.streamingVelocity - a.metrics.streamingVelocity
      case 'followers':
        // fallback heuristic for non-artists
        return (b.kind === 'artist' ? 1 : 0) - (a.kind === 'artist' ? 1 : 0)
      case 'potential':
        return b.metrics.breakoutProbability - a.metrics.breakoutProbability
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar Offset */}
      <div className="lg:ml-72">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
          {/* Mobile top bar (same vibe as Home/Scout) */}
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

          <Card className="bg-card/60 backdrop-blur border-border py-0 overflow-hidden">
            <div className="p-5 border-b border-border space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
                    <SearchIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold">Explore</p>
                    <p className="text-xs text-muted-foreground">Find artists and trend signals</p>
                  </div>
                </div>

                {(searchQuery || filterGenre !== 'all' || typeFilter !== 'all') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterGenre('all')
                      setTypeFilter('all')
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>

              <div className="flex gap-3 flex-col">
                <div className="flex gap-3 flex-col sm:flex-row">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search artists, songs, or albums…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11"
                    />
                    {searchQuery ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>

                  <div className="flex gap-2 flex-col sm:flex-row sm:items-center">
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                      <SelectTrigger className="h-11 sm:w-44">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="artists">Artists</SelectItem>
                        <SelectItem value="songs">Songs</SelectItem>
                        <SelectItem value="albums">Albums</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterGenre} onValueChange={setFilterGenre}>
                      <SelectTrigger className="h-11 sm:w-44">
                        <SelectValue placeholder="Genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genreOptions.map((g) => (
                          <SelectItem key={g.value} value={g.value}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-11 sm:w-44">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="streams">Most Streams</SelectItem>
                        <SelectItem value="followers">Most Followers</SelectItem>
                        <SelectItem value="potential">Breakout Potential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quick genre chips */}
                <div className="-mx-5">
                  <div className="flex gap-2 overflow-x-auto px-5 pb-1 scroll-px-5">
                    {genreOptions.map((g) => {
                      const active = filterGenre === g.value
                      return (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setFilterGenre(g.value)}
                          className={[
                            'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition',
                            active
                              ? 'bg-signal-cyan/10 border-signal-cyan/30 text-signal-cyan'
                              : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/30',
                          ].join(' ')}
                        >
                          {g.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5">
              {!showBrowseState ? (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">
                      Found <span className="text-foreground font-semibold">{sortedResults.length}</span>{' '}
                      result{sortedResults.length !== 1 ? 's' : ''}
                      {searchQuery && (
                        <>
                          {' '}
                          matching <span className="text-foreground font-semibold">“{searchQuery}”</span>
                        </>
                      )}
                      {filterGenre !== 'all' && (
                        <>
                          {' '}
                          in <span className="text-foreground font-semibold">{filterGenre}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Tip: try “Afrobeats” or “Amapiano”.</p>
                  </div>

                  {sortedResults.length > 0 ? (
                    <div className="space-y-3">
                      {sortedResults.map((r) => (
                        <Link
                          key={`${r.kind}-${r.id}`}
                          href={r.href}
                          className="block rounded-2xl border border-border bg-background/40 p-4 hover:bg-muted/15 transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={r.image}
                                alt={r.title}
                                className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                                loading="lazy"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold truncate">
                                  {r.title}{' '}
                                  <span className="text-xs text-muted-foreground">
                                    • {r.kind.toUpperCase()}
                                  </span>
                                </p>
                                <p className="text-sm text-muted-foreground truncate">{r.subtitle}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[11px] text-muted-foreground">Trend Score</p>
                              <p className="text-lg font-bold text-signal-purple">{r.metrics.trendScore}%</p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Mentions growth</p>
                              <p className="font-semibold">{r.metrics.mentionsGrowth}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Social velocity</p>
                              <p className="font-semibold">{r.metrics.socialVelocity}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Sentiment score</p>
                              <p className="font-semibold">{r.metrics.sentimentScore}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Sentiment momentum</p>
                              <p className="font-semibold">{r.metrics.sentimentMomentum}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">TikTok audio usage</p>
                              <p className="font-semibold">{r.metrics.tiktokUsage}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Shazam spikes</p>
                              <p className="font-semibold">{r.metrics.shazamSpikes}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Playlist velocity</p>
                              <p className="font-semibold">{r.metrics.playlistVelocity}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3">
                              <p className="text-[11px] text-muted-foreground">Streaming velocity</p>
                              <p className="font-semibold">{r.metrics.streamingVelocity}%</p>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/10 p-3 col-span-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] text-muted-foreground">Breakout probability</p>
                                <p className="font-semibold">{r.metrics.breakoutProbability}%</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <SearchIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                      <p className="text-foreground text-lg font-semibold">No results found</p>
                      <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                        Try a different spelling, change type/genre filters, or reset to see what’s trending.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-8">
                  {/* <div className="rounded-xl border border-border bg-background/30 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <SearchIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">Browse artists</h2>
                        <p className="text-muted-foreground mt-1">
                          Start typing to search, or pick a genre chip above to filter instantly.
                        </p>
                      </div>
                    </div>
                  </div> */}

                  <div>
                    <div className="flex items-end justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Trending artists</h3>
                        <p className="text-sm text-muted-foreground">A quick starting point from today’s signals.</p>
                      </div>
                    </div>

                    {(() => {
                      const trendingArtists = [...artists].sort((a, b) => a.trendingRank - b.trendingRank).slice(0, 8)

                      return (
                        <>
                          <div className="-mx-5 md:hidden">
                            <div className="flex gap-4 overflow-x-auto px-5 pb-2 snap-x snap-mandatory scroll-px-5 touch-pan-x overscroll-x-contain">
                              {trendingArtists.map((artist) => (
                                <div key={artist.id} className="snap-start shrink-0 w-[280px]">
                                  <Link href={`/artist/${artist.id}`} className="block">
                                    <div className="rounded-2xl border border-border bg-background/40 p-4">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={artist.image}
                                          alt={artist.name}
                                          className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                                          loading="lazy"
                                        />
                                        <div className="min-w-0">
                                          <p className="font-semibold truncate">{artist.name}</p>
                                          <p className="text-sm text-muted-foreground truncate">
                                            {artist.country} • {artist.genre[0]}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {trendingArtists.map((artist) => (
                              <Link key={artist.id} href={`/artist/${artist.id}`} className="block">
                                <div className="rounded-2xl border border-border bg-background/40 p-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={artist.image}
                                      alt={artist.name}
                                      className="h-11 w-11 rounded-full object-cover border border-border bg-muted shrink-0"
                                      loading="lazy"
                                    />
                                    <div className="min-w-0">
                                      <p className="font-semibold truncate">{artist.name}</p>
                                      <p className="text-sm text-muted-foreground truncate">
                                        {artist.country} • {artist.genre[0]}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
