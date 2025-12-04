// components/charts/PieChart.tsx

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  height?: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#2180a0",
  "#32b8c6",
  "#1a6873",
  "#5e5240",
  "#8b7d6b",
  "#463a2d",
];

export function PieChart({
  data,
  title,
  height = 300,
  colors = DEFAULT_COLORS,
}: PieChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
