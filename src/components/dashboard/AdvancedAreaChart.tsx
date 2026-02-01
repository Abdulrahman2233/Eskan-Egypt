import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AdvancedAreaChartProps {
  data: Array<{ name: string; value: number; value2?: number; value3?: number }>;
  title: string;
  subtitle?: string;
  trend?: { value: number; trend: "up" | "down" };
  series?: Array<{ key: string; name: string; color: string }>;
}

export function AdvancedAreaChart({ 
  data, 
  title, 
  subtitle, 
  trend,
  series = [
    { key: "value", name: "هذا العام", color: "#0ea5e9" },
    { key: "value2", name: "العام السابق", color: "#14b8a6" },
  ]
}: AdvancedAreaChartProps) {
  return (
    <div className="card-glow rounded-2xl bg-card p-5 lg:p-6 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            trend.trend === "up" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {trend.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.4} />
                  <stop offset="50%" stopColor={s.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
              opacity={0.5}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={50}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                padding: '12px 16px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: 8 }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
              formatter={(value: number) => [`${value.toLocaleString()} ريال`, '']}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 10 }}
            />
            {series.map((s) => (
              data[0]?.[s.key as keyof typeof data[0]] !== undefined && (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={3}
                  fill={`url(#gradient-${s.key})`}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
