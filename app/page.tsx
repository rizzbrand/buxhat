'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignalCard } from '@/components/buxhat/SignalCard'
import { MetricCard } from '@/components/buxhat/MetricCard'
import { TrendChart } from '@/components/buxhat/TrendChart'
import { Zap, Flame, Heart } from 'lucide-react'
import {
  artists,
  trendData,
  trendingNow,
  favorites,
} from '@/lib/mock-data'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('discover')

  const summaryMetrics = {
    totalTrends: trendingNow.length,
    topSentiment: 94,
    avgMomentum: 42,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar Offset */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-background border-b border-border sticky top-0 z-10 backdrop-blur-md bg-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-signal-cyan via-signal-purple to-signal-blue rounded-lg flex items-center justify-center lg:hidden shadow-lg shadow-signal-cyan/20">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-signal-cyan to-signal-purple bg-clip-text text-transparent">BuxHat</h1>
            </div>
            <p className="text-muted-foreground">
              African Music Trend Intelligence Platform
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid mb-8 bg-card border border-border">
              <TabsTrigger value="discover" className="gap-2 data-[state=active]:bg-signal-cyan/10 data-[state=active]:border-signal-cyan/20">
                <Flame className="w-4 h-4" />
                <span className="hidden sm:inline">Discover</span>
              </TabsTrigger>
              <TabsTrigger value="highlights" className="gap-2 data-[state=active]:bg-signal-purple/10 data-[state=active]:border-signal-purple/20">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Highlights</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2 data-[state=active]:bg-signal-green/10 data-[state=active]:border-signal-green/20">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favorites</span>
              </TabsTrigger>
            </TabsList>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-8 mt-0">
              <div>
                <h2 className="text-xl font-bold mb-4">Trending Now</h2>
                <div className="-mx-4 sm:mx-0">
                  <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scroll-px-4 touch-pan-x overscroll-x-contain">
                    {artists.map((artist) => (
                      <div
                        key={artist.id}
                        className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[320px]"
                      >
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
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Trending Songs</h2>
                <div className="space-y-3">
                  {trendingNow.map((song) => (
                    <div
                      key={song.id}
                      className="card-glow p-4 flex items-center justify-between hover:shadow-lg hover:shadow-signal-blue/20"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{song.song}</h3>
                        <p className="text-sm text-muted-foreground">
                          {song.artist} • {song.genre}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-signal-blue">{(song.streams / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-signal-green font-semibold">+{song.change}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="space-y-8 mt-0">
              {/* Key Metrics */}
              <div>
                <h2 className="text-xl font-bold mb-4">Today's Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Trending Today"
                    value={summaryMetrics.totalTrends}
                    subtitle="Songs trending globally"
                    change={12}
                    variant="cyan"
                  />
                  <MetricCard
                    title="Avg Sentiment"
                    value={`${summaryMetrics.topSentiment}%`}
                    subtitle="Overall listener sentiment"
                    change={5}
                    variant="purple"
                  />
                  <MetricCard
                    title="Momentum Score"
                    value={`${summaryMetrics.avgMomentum}%`}
                    subtitle="Average trend acceleration"
                    change={8}
                    variant="orange"
                  />
                </div>
              </div>

              {/* Trend Analysis */}
              <div>
                <h2 className="text-xl font-bold mb-4">Stream Trends & Momentum</h2>
                <TrendChart
                  data={trendData}
                  dataKeys={['streams']}
                  title="Monthly Stream Trends (12 Months)"
                  type="area"
                  colors={['#3B82F6']}
                  height={300}
                />
              </div>

              {/* Breakout Artists */}
              <div>
                <h2 className="text-xl font-bold mb-4">🔥 Rising & Breakout Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {artists
                    .sort((a, b) => (b.breakoutPotential || 0) - (a.breakoutPotential || 0))
                    .slice(0, 4)
                    .map((artist) => (
                      <SignalCard
                        key={artist.id}
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
              </div>

              {/* Weekly Winners */}
              <div>
                <h2 className="text-xl font-bold mb-4">Weekly Winners</h2>
                <div className="space-y-3">
                  {trendingNow.slice(0, 6).map((song, index) => (
                    <div
                      key={song.id}
                      className="card-glow p-4 flex items-center justify-between group hover:shadow-lg hover:shadow-signal-green/20"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-2xl font-bold text-muted-foreground min-w-8">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{song.song}</h3>
                          <p className="text-sm text-muted-foreground">
                            {song.artist} • {song.genre}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-signal-blue">{(song.streams / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-signal-green font-semibold">+{song.change}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-8 mt-0">
              {/* Favorites Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Favorited Artists"
                  value={favorites.length}
                  subtitle="In your collection"
                  variant="cyan"
                />
                <MetricCard
                  title="Combined Followers"
                  value={`${(
                    favorites.reduce(
                      (sum, fav) =>
                        sum +
                        (artists.find((a) => a.id === fav.id)?.followers || 0),
                      0
                    ) / 1000000
                  ).toFixed(1)}M`}
                  subtitle="Your favorite artists"
                  variant="purple"
                />
                <MetricCard
                  title="Combined Streams"
                  value={`${(
                    favorites.reduce(
                      (sum, fav) => sum + (fav.monthlyStreams || 0),
                      0
                    ) / 1000000
                  ).toFixed(0)}M`}
                  subtitle="Monthly combined streams"
                  variant="green"
                />
              </div>

              {/* Favorited Artists Cards */}
              <div>
                <h2 className="text-xl font-bold mb-4">Your Favorite Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((artist) => (
                    <SignalCard
                      key={artist.id}
                      artist={artist.name}
                      image={artists.find((a) => a.id === artist.id)?.image || ''}
                      genre={artist.genre}
                      rank={artists.find((a) => a.id === artist.id)?.trendingRank || 0}
                      change={artists.find((a) => a.id === artist.id)?.trendChange || 0}
                      streams={artist.monthlyStreams}
                      followers={artist.followers}
                      breakoutPotential={
                        artists.find((a) => a.id === artist.id)?.breakoutPotential || 0
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Favorites Performance */}
              <div>
                <h2 className="text-xl font-bold mb-4">Your Favorites Performance</h2>
                <TrendChart
                  data={trendData}
                  dataKeys={['streams']}
                  title="Performance Trend (Your Favorites)"
                  type="area"
                  colors={['#00D9FF']}
                  height={280}
                />
              </div>

              {/* Favorites Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-glow p-6">
                  <h3 className="font-bold text-lg mb-4">Top Favorite by Streams</h3>
                  {favorites.length > 0 && (
                    <div className="space-y-4">
                      {favorites
                        .sort((a, b) => (b.monthlyStreams || 0) - (a.monthlyStreams || 0))
                        .slice(0, 3)
                        .map((artist, idx) => (
                          <div key={artist.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(artist.monthlyStreams / 1000000).toFixed(1)}M monthly
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-signal-blue">
                                #{idx + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="card-glow p-6">
                  <h3 className="font-bold text-lg mb-4">Top Favorite by Followers</h3>
                  {favorites.length > 0 && (
                    <div className="space-y-4">
                      {favorites
                        .map((fav) => ({
                          ...fav,
                          followerCount: artists.find((a) => a.id === fav.id)?.followers || 0,
                        }))
                        .sort((a, b) => b.followerCount - a.followerCount)
                        .slice(0, 3)
                        .map((artist, idx) => (
                          <div key={artist.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(artist.followerCount / 1000000).toFixed(1)}M followers
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-signal-cyan">
                                #{idx + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
