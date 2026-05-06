'use client'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RadarDataPoint {
  name: string
  x: number
  y: number
  potential?: number
  momentum?: number
  engagement?: number
}

interface BreakoutRadarProps {
  data: RadarDataPoint[]
  title?: string
  height?: number
}

export function BreakoutRadar({
  data,
  title = 'Breakout Potential Radar',
  height = 350,
}: BreakoutRadarProps) {
  return (
    <div className="card-glow p-4">
      <h3 className="text-sm font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="x"
            name="Momentum"
            type="number"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
            domain={[0, 100]}
          />
          <YAxis
            dataKey="y"
            name="Engagement"
            type="number"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1F2E',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#E8EAEF' }}
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload as RadarDataPoint
                return (
                  <div className="bg-card border border-border rounded-lg p-2">
                    <p className="text-foreground text-xs font-semibold">{data.name}</p>
                    <p className="text-muted-foreground text-xs">Potential: {data.potential}%</p>
                    <p className="text-muted-foreground text-xs">Momentum: {data.momentum}%</p>
                    <p className="text-muted-foreground text-xs">Engagement: {data.engagement}%</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Scatter name="Artists" data={data} fill="#7C3AED" />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-muted/30 border border-border rounded text-xs text-muted-foreground">
        <p>
          <strong>X-axis:</strong> Trend Momentum (how fast gaining traction)
        </p>
        <p>
          <strong>Y-axis:</strong> Engagement Level (listener interaction)
        </p>
        <p>
          <strong>Bubble Size:</strong> Breakout Potential Score
        </p>
      </div>
    </div>
  )
}
