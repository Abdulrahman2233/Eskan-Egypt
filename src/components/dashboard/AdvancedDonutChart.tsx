import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { useState, useCallback } from "react";

interface AdvancedDonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  subtitle?: string;
  centerValue?: string;
  centerLabel?: string;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius - 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export function AdvancedDonutChart({ data, title, subtitle, centerValue, centerLabel }: AdvancedDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const onMouseEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);
  
  const onMouseLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  return (
    <div className="card-glow rounded-2xl bg-card p-5 lg:p-6 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      <div className="relative h-56 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#pieGradient-${index})`}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                padding: '12px 16px',
              }}
              formatter={(value: number, name: string) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {centerValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              {centerValue}
            </span>
            {centerLabel && <span className="text-sm text-muted-foreground mt-1">{centerLabel}</span>}
          </div>
        )}
      </div>
      
      {/* Enhanced Legend */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeIndex === index ? 'bg-muted scale-105' : 'hover:bg-muted/50'
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            <div 
              className="h-4 w-4 rounded-lg shadow-sm" 
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
