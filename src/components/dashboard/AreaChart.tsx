import { Area, AreaChart as RechartsArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AreaChartProps {
  data: Array<{ name: string; value: number; value2?: number }>;
  title: string;
  subtitle?: string;
}

export function AreaChart({ data, title, subtitle }: AreaChartProps) {
  return (
    <div className="rounded-lg p-6 lg:p-8 bg-white border border-gray-200">
      <div className="mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      
      <div className="h-48 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsArea data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0ea5e9" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            {data[0]?.value2 !== undefined && (
              <Area 
                type="monotone" 
                dataKey="value2" 
                stroke="#14b8a6" 
                fillOpacity={1} 
                fill="url(#colorValue2)" 
              />
            )}
          </RechartsArea>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
