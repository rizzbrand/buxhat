'use client'

import { useState } from 'react'
import { Search as SearchIcon, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SignalCard } from '@/components/buxhat/SignalCard'
import { artists } from '@/lib/mock-data'

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

  const showBrowseState = !searchQuery && filterGenre === 'all'

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesGenre =
      filterGenre === 'all' || artist.genre.includes(filterGenre)
    return matchesSearch && matchesGenre
  })

  const sortedArtists = [...filteredArtists].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return a.trendingRank - b.trendingRank
      case 'streams':
        return b.monthlyStreams - a.monthlyStreams
      case 'followers':
        return b.followers - a.followers
      case 'potential':
        return b.breakoutPotential - a.breakoutPotential
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar Offset */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <SearchIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Search</h1>
            </div>
            <p className="text-muted-foreground">
              Find and explore African music artists
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-background/80 backdrop-blur-md border-b border-border sm:sticky sm:top-[96px] z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex gap-3 flex-col">
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search artists or genres…"
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
              <div className="-mx-4 sm:mx-0">
                <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-1 scroll-px-4">
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
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showBrowseState ? (
            <>
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Found <span className="text-foreground font-semibold">{sortedArtists.length}</span>{' '}
                      artist{sortedArtists.length !== 1 ? 's' : ''}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Tip: try “Afrobeats” or “Amapiano”.
                    </p>
                  </div>

                  {(searchQuery || filterGenre !== 'all') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setSearchQuery('')
                        setFilterGenre('all')
                      }}
                    >
                      <Filter className="w-4 h-4" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {sortedArtists.length > 0 ? (
                <>
                  {/* Mobile: swipe slider */}
                  <div className="-mx-4 sm:mx-0 md:hidden">
                    <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scroll-px-4 touch-pan-x overscroll-x-contain">
                      {sortedArtists.map((artist) => (
                        <div key={artist.id} className="snap-start shrink-0 w-[280px]">
                          <SignalCard
                            href={`/artist/${artist.id}`}
                            artist={artist.name}
                            image={artist.image}
                            genre={artist.genre[0]}
                            rank={artist.trendingRank}
                            change={artist.trendChange}
                            streams={artist.monthlyStreams}
                            followers={artist.followers}
                            breakoutPotential={artist.breakoutPotential}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop/tablet: grid */}
                  <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedArtists.map((artist) => (
                      <SignalCard
                        key={artist.id}
                        href={`/artist/${artist.id}`}
                        artist={artist.name}
                        image={artist.image}
                        genre={artist.genre[0]}
                        rank={artist.trendingRank}
                        change={artist.trendChange}
                        streams={artist.monthlyStreams}
                        followers={artist.followers}
                        breakoutPotential={artist.breakoutPotential}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <SearchIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-foreground text-lg font-semibold">No artists found</p>
                  <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                    Try a different spelling, broaden the genre filter, or reset to see what’s trending.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-8">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
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
              </div>

              <div>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Trending artists</h3>
                    <p className="text-sm text-muted-foreground">A quick starting point from today’s signals.</p>
                  </div>
                </div>

                {(() => {
                  const trendingArtists = [...artists]
                    .sort((a, b) => a.trendingRank - b.trendingRank)
                    .slice(0, 8)

                  return (
                    <>
                      {/* Mobile: swipe slider */}
                      <div className="-mx-4 sm:mx-0 md:hidden">
                        <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scroll-px-4 touch-pan-x overscroll-x-contain">
                          {trendingArtists.map((artist) => (
                            <div key={artist.id} className="snap-start shrink-0 w-[280px]">
                              <SignalCard
                                href={`/artist/${artist.id}`}
                                artist={artist.name}
                                image={artist.image}
                                genre={artist.genre[0]}
                                rank={artist.trendingRank}
                                change={artist.trendChange}
                                streams={artist.monthlyStreams}
                                followers={artist.followers}
                                breakoutPotential={artist.breakoutPotential}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Desktop/tablet: grid */}
                      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {trendingArtists.map((artist) => (
                          <SignalCard
                            key={artist.id}
                            href={`/artist/${artist.id}`}
                            artist={artist.name}
                            image={artist.image}
                            genre={artist.genre[0]}
                            rank={artist.trendingRank}
                            change={artist.trendChange}
                            streams={artist.monthlyStreams}
                            followers={artist.followers}
                            breakoutPotential={artist.breakoutPotential}
                          />
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
