'use client'

import { useState } from 'react'
import { User, Settings, LogOut, Bell, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MetricCard } from '@/components/buxhat/MetricCard'
import { SignalCard } from '@/components/buxhat/SignalCard'
import { favorites, artists } from '@/lib/mock-data'

export default function ProfilePage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [breakoutNotifications, setBreakoutNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [trendingUpdates, setTrendingUpdates] = useState(true)
  const [preferredRegion, setPreferredRegion] = useState('all-africa')

  const userStats = {
    reportsGenerated: 47,
    artistsTracked: 25,
    favoriteArtists: favorites.length,
    lastActive: 'Today at 2:34 PM',
  }

  const favoriteArtistsData = artists.filter((a) =>
    favorites.some((f) => f.id === a.id)
  )

  const profileImage = '/scout.jpg'

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar Offset */}
      <div className="lg:ml-64">
        {/* Profile Header */}
        <div className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-border bg-muted shadow-sm">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Music Scout</h1>
                  <p className="text-sm text-muted-foreground mt-1">scout@buxhat.com</p>
                  <p className="text-xs text-muted-foreground mt-2">Last active: {userStats.lastActive}</p>
                </div>
              </div>

              <div className="sm:ml-auto flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Stats */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold">Your Activity</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  A quick overview of what you’ve been tracking.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Reports Generated"
                value={userStats.reportsGenerated}
                subtitle="This month"
                change={12}
                variant="purple"
              />
              <MetricCard
                title="Artists Tracked"
                value={userStats.artistsTracked}
                subtitle="Monitoring growth"
                change={8}
                variant="cyan"
              />
              <MetricCard
                title="Favorite Artists"
                value={userStats.favoriteArtists}
                subtitle="Saved for quick access"
                variant="blue"
              />
              <MetricCard
                title="Watchlist Items"
                value="12"
                subtitle="Active alerts"
                change={3}
                variant="orange"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Email alerts</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Get important changes in your inbox.</p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Breakout notifications</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Be first to spot breakout artists.</p>
                  </div>
                  <Switch checked={breakoutNotifications} onCheckedChange={setBreakoutNotifications} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Weekly digest</p>
                    <p className="text-xs text-muted-foreground mt-0.5">A weekly summary of your watchlist.</p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Trending updates</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Daily highlights from new trends.</p>
                  </div>
                  <Switch checked={trendingUpdates} onCheckedChange={setTrendingUpdates} />
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Preferences</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Preferred Region</label>
                  <Select value={preferredRegion} onValueChange={setPreferredRegion}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-africa">All Africa</SelectItem>
                      <SelectItem value="west-africa">West Africa</SelectItem>
                      <SelectItem value="south-africa">South Africa</SelectItem>
                      <SelectItem value="east-africa">East Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Favorite Genres</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Afrobeats', 'Amapiano', 'Hip-Hop', 'Reggae'].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm cursor-pointer hover:bg-muted/30 transition"
                      >
                        <input type="checkbox" defaultChecked={g !== 'Hip-Hop' && g !== 'Reggae'} className="w-4 h-4 rounded" />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Favorite Artists */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold">Your Favorite Artists</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Quick access to the artists you care about most.
                </p>
              </div>
            </div>
            {favoriteArtistsData.length > 0 ? (
              <>
                {/* Mobile: swipe rail */}
                <div className="-mx-4 sm:mx-0 md:hidden">
                  <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scroll-px-4 touch-pan-x overscroll-x-contain">
                    {favoriteArtistsData.map((artist) => (
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
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteArtistsData.map((artist) => (
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
              <Card className="p-8 bg-card border-border text-center">
                <p className="text-muted-foreground">No favorite artists yet</p>
              </Card>
            )}
          </div>

          {/* Recently Viewed */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold">Recently Viewed</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pick up where you left off.
                </p>
              </div>
            </div>
            <>
              {/* Mobile: swipe rail */}
              <div className="-mx-4 sm:mx-0 md:hidden">
                <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scroll-px-4 touch-pan-x overscroll-x-contain">
                  {artists.slice(0, 4).map((artist) => (
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
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                {artists.slice(0, 4).map((artist) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}
