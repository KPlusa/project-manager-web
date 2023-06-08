import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./styles.css";

const data = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 3490,
  },
];
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
  };
export default function Chart() {
  return (
    <>
      <ResponsiveContainer minHeight="50vh" minWidth="100vw">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#ffffff" }} />
          <YAxis tick={{ fill: "#ffffff" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#eab676" barSize={100}/>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
