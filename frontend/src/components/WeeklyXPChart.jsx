import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function WeeklyXPChart({ xp }) {
  // fake weekly distribution based on XP
  const data = [
    { day: "Mon", xp: Math.max(10, xp * 0.1) },
    { day: "Tue", xp: Math.max(20, xp * 0.15) },
    { day: "Wed", xp: Math.max(15, xp * 0.12) },
    { day: "Thu", xp: Math.max(25, xp * 0.18) },
    { day: "Fri", xp: Math.max(30, xp * 0.2) },
    { day: "Sat", xp: Math.max(20, xp * 0.15) },
    { day: "Sun", xp: Math.max(10, xp * 0.1) },
  ];

  return (
    <div className="card">
      <div className="mb-4">
        <p className="text-purple-400 text-xs uppercase">
          Weekly Progress
        </p>
        <h2 className="text-white text-xl font-bold">
          XP Activity
        </h2>
      </div>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis dataKey="day" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}