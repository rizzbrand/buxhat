'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Share2, Music, Zap, TrendingUp, Users, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/buxhat/MetricCard'
import { TrendChart } from '@/components/buxhat/TrendChart'
import { SignalCard } from '@/components/buxhat/SignalCard'
import { trendData, artists, artistAnalyticsById } from '@/lib/mock-data'

export default function ArtistDetailPage() {
  const params = useParams()
  const artistId = params.id as string
  const artist = artists.find((a) => a.id === artistId) || artists[0]
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  const relatedArtists = artists.filter((a) => a.id !== artist.id).slice(0, 4)
  const analytics = artistAnalyticsById[artist.id] || artistAnalyticsById['1']

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar Offset */}
      <div className="lg:ml-72">
        {/* Banner */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-b from-primary/20 to-background">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Artist Header */}
        <div className="relative -mt-20 lg:-mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 items-end">
            <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-lg overflow-hidden border-4 border-background shadow-lg flex-shrink-0">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-4">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                {artist.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">{artist.country}</p>
              <div className="flex gap-3 flex-wrap">
                <Link href={`/scout?a=${artist.id}&b=${relatedArtists[0]?.id || artists[1]?.id || '2'}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Compare Artist
                  </Button>
                </Link>
                <Button
                  variant={isWatchlisted ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
                </Button>
                <Button
                  variant={isFavorite ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Key Metrics */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Monthly Streams"
                value={`${(artist.monthlyStreams / 1000000).toFixed(1)}M`}
                change={12}
                icon={<Music className="w-5 h-5" />}
                variant="blue"
              />
              <MetricCard
                title="Total Followers"
                value={`${(artist.followers / 1000000).toFixed(1)}M`}
                change={8}
                icon={<Users className="w-5 h-5" />}
                variant="cyan"
              />
              <MetricCard
                title="Trend Score"
                value={`${analytics.trendScore}%`}
                change={5}
                icon={<Zap className="w-5 h-5" />}
                variant="purple"
              />
              <MetricCard
                title="Breakout Probability"
                value={`${analytics.breakoutProbability}%`}
                change={3}
                icon={<TrendingUp className="w-5 h-5" />}
                variant="orange"
              />
            </div>
          </div>

          {/* Signal breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card-glow p-6">
              <h2 className="text-2xl font-bold mb-1">Signal breakdown</h2>
              <p className="text-sm text-muted-foreground mb-5">
                A quick view of what’s driving the trend and breakout score.
              </p>

              <div className="space-y-4">
                {analytics.signalBreakdown.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.hint}</p>
                      </div>
                      <span className="text-sm font-bold">{s.value}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-signal-purple to-signal-cyan"
                        style={{ width: `${s.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow p-6">
              <h2 className="text-2xl font-bold mb-1">Forecast</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Actual vs projected growth.
              </p>
              <TrendChart
                data={analytics.forecastChart}
                dataKeys={['actual', 'forecast']}
                title="Forecast chart"
                type="line"
                colors={['#06b6d4', '#a855f7']}
                height={260}
              />
            </div>
          </div>

          {/* Genres & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {artist.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">Top Songs</h2>
              <div className="space-y-3">
                {[
                  { title: artist.name + ' - Song 1', streams: 2500000 },
                  { title: artist.name + ' - Song 2', streams: 2100000 },
                  { title: artist.name + ' - Song 3', streams: 1950000 },
                ].map((song, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {(song.streams / 1000000).toFixed(1)}M streams
                      </p>
                    </div>
                    <Music className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Songs</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Collaborations</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Current Rank</p>
                  <p className="text-2xl font-bold">#{artist.trendingRank}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Trend Change</p>
                  <p className={`text-2xl font-bold ${artist.trendChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {artist.trendChange >= 0 ? '+' : ''}{artist.trendChange}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Trend Analysis</h2>
            <TrendChart
              data={trendData}
              dataKeys={['streams', 'engagement']}
              title="Performance Metrics (12 Months)"
              type="area"
              colors={['#a855f7', '#06b6d4']}
              height={350}
            />
          </div>

          {/* Related Artists */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Related Artists</h2>
            <>
              {/* Mobile: swipe slider */}
              <div className="-mx-4 sm:mx-0 md:hidden">
                <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scroll-px-4 touch-pan-x overscroll-x-contain">
                  {relatedArtists.map((relatedArtist) => (
                    <div key={relatedArtist.id} className="snap-start shrink-0 w-[280px]">
                      <SignalCard
                        href={`/artist/${relatedArtist.id}`}
                        artist={relatedArtist.name}
                        image={relatedArtist.image}
                        genre={relatedArtist.genre[0]}
                        rank={relatedArtist.trendingRank}
                        change={relatedArtist.trendChange}
                        streams={relatedArtist.monthlyStreams}
                        followers={relatedArtist.followers}
                        breakoutPotential={relatedArtist.breakoutPotential}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/tablet: grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedArtists.map((relatedArtist) => (
                  <SignalCard
                    key={relatedArtist.id}
                    href={`/artist/${relatedArtist.id}`}
                    artist={relatedArtist.name}
                    image={relatedArtist.image}
                    genre={relatedArtist.genre[0]}
                    rank={relatedArtist.trendingRank}
                    change={relatedArtist.trendChange}
                    streams={relatedArtist.monthlyStreams}
                    followers={relatedArtist.followers}
                    breakoutPotential={relatedArtist.breakoutPotential}
                  />
                ))}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  )
}
