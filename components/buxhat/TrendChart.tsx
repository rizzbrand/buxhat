'use client'

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrendChartProps {
  data: Array<Record<string, string | number>>
  dataKeys: string[]
  title: string
  type?: 'line' | 'area'
  colors?: string[]
  height?: number
}

const defaultColors = ['#00D9FF', '#7C3AED', '#3B82F6', '#10B981', '#F97316']

export function TrendChart({
  data,
  dataKeys,
  title,
  type = 'line',
  colors = defaultColors,
  height = 300,
}: TrendChartProps) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart
  const DataComponent = type === 'area' ? Area : Line

  return (
    <div className="card-glow p-4">
      <h3 className="text-sm font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
          />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1F2E',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#E8EAEF' }}
            cursor={{ stroke: '#00D9FF', strokeDasharray: '5 5' }}
          />
          {dataKeys.map((key, index) => (
            <DataComponent
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={type === 'area' ? colors[index % colors.length] : 'transparent'}
              fillOpacity={type === 'area' ? 0.1 : 0}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
