import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  subtitle?: string;
  centerValue?: string;
  centerLabel?: string;
}

export function DonutChart({ data, title, subtitle, centerValue, centerLabel }: DonutChartProps) {
  return (
    <div className="rounded-lg p-6 lg:p-8 bg-white border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      
      <div className="relative h-44 lg:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#1e293b',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl lg:text-3xl font-bold">{centerValue}</span>
            {centerLabel && <span className="text-xs lg:text-sm text-muted-foreground">{centerLabel}</span>}
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 lg:gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
