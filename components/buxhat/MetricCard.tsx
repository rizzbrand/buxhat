'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  icon?: React.ReactNode
  variant?: 'default' | 'cyan' | 'purple' | 'blue' | 'green' | 'orange'
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = 'default',
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0
  
  const variantClasses = {
    cyan: 'bg-signal-cyan/10 border-signal-cyan/20',
    purple: 'bg-signal-purple/10 border-signal-purple/20',
    blue: 'bg-signal-blue/10 border-signal-blue/20',
    green: 'bg-signal-green/10 border-signal-green/20',
    orange: 'bg-signal-orange/10 border-signal-orange/20',
    default: 'bg-muted/30 border-border',
  }

  const bgClass = variantClasses[variant] || variantClasses.default

  return (
    <div className={`card-glow p-4 ${bgClass}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium mb-2">{title}</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {change !== undefined && (
              <div className="flex items-center gap-1 mb-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-signal-green" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={`text-xs font-semibold ${isPositive ? 'text-signal-green' : 'text-destructive'}`}
                >
                  {isPositive ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  )
}
