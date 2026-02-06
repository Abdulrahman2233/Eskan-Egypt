import { Bar, BarChart as RechartsBar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  subtitle?: string;
}

export function BarChart({ data, title, subtitle }: BarChartProps) {
  return (
    <div className="rounded-lg p-4 lg:p-6 bg-white border border-gray-200 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs lg:text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBar data={data} margin={{ top: 15, right: 15, left: 10, bottom: 50 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="name"
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              angle={-35}
              textAnchor="end"
              height={90}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                color: '#1f2937',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '12px',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'العدد']}
              labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="value" 
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={600}
              isAnimationActive={true}
              maxBarSize={60}
            />
          </RechartsBar>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
