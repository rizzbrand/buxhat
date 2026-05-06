'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

interface SignalCardProps {
  href?: string
  artist: string
  image: string
  genre: string
  rank: number
  change: number
  streams: number
  followers: number
  breakoutPotential: number
}

export function SignalCard({
  href,
  artist,
  image,
  genre,
  rank,
  change,
  streams,
  followers,
  breakoutPotential,
}: SignalCardProps) {
  const isPositive = change >= 0
  const formattedStreams = (streams / 1000000).toFixed(1)
  const formattedFollowers = (followers / 1000000).toFixed(1)

  const CardInner = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={artist}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            #{rank}
          </span>
          <span
            className={[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur',
              isPositive ? 'bg-signal-green/20 text-signal-green' : 'bg-destructive/20 text-destructive',
            ].join(' ')}
          >
            {isPositive ? <TrendingUp className="mr-1 h-3.5 w-3.5" /> : <TrendingDown className="mr-1 h-3.5 w-3.5" />}
            {isPositive ? '+' : ''}
            {change}%
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold leading-tight text-white">{artist}</h3>
          <p className="mt-1 text-xs text-white/70">{genre}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-background/40 border border-border px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Monthly streams</p>
            <p className="mt-0.5 text-sm font-semibold text-signal-blue">{formattedStreams}M</p>
          </div>
          <div className="rounded-md bg-background/40 border border-border px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Followers</p>
            <p className="mt-0.5 text-sm font-semibold text-signal-cyan">{formattedFollowers}M</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Breakout potential</span>
            <span className="text-xs font-semibold text-signal-orange">{breakoutPotential}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-signal-orange to-signal-green"
              style={{ width: `${breakoutPotential}%` }}
            />
          </div>
        </div>
      </div>
    </>
  )

  const baseClassName =
    'signal-card group block overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-0.5 hover:shadow-lg hover:shadow-signal-cyan/10 transition'

  return href ? (
    <Link href={href} className={baseClassName} aria-label={`Open ${artist}`}>
      {CardInner}
    </Link>
  ) : (
    <div className={baseClassName}>{CardInner}</div>
  )
}
