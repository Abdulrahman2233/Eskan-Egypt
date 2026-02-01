import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Home, MapPin, DollarSign, AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon: React.ReactNode;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  bgColor = 'bg-blue-50'
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
        </div>
        <div className="text-blue-600 opacity-75">{icon}</div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-green-600 text-sm font-medium ml-1">{trend}%</span>
        </div>
      )}
    </div>
  );
};

interface BarChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  title: string;
  dataKey: string;
  color?: string;
}

export const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  dataKey,
  color = '#3b82f6'
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface LineChartProps {
  data: Array<{ date: string; count: number; [key: string]: any }>;
  title: string;
  color?: string;
}

export const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = '#10b981'
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PieChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  title: string;
  colors?: string[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  title,
  colors = COLORS
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface TableProps {
  columns: Array<{ key: string; label: string }>;
  data: Array<{ [key: string]: any }>;
  title: string;
}

export const DataTable: React.FC<TableProps> = ({ columns, data, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default {
  StatCard,
  CustomBarChart,
  CustomLineChart,
  CustomPieChart,
  DataTable,
};
