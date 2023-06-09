import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { ProjectTypeChart } from "../../models/projectTypeChart";
import { ProjectStatusChart } from "../../models/projectStatusChart";
import "./chart.css";

interface ChartProps {
  data: (ProjectTypeChart | ProjectStatusChart)[];
  title: string;
}

export default function Chart({ data, title }: ChartProps) {
  return (
    <div className="chart-container">
      <h2 className="chart-title">{title}</h2>
      <ResponsiveContainer minHeight="50vh" minWidth="100vw">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#ffffff" }} />
          <YAxis tick={{ fill: "#ffffff" }} />
          <Tooltip />
          <Bar dataKey="number" fill="#eab676" barSize={100} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
