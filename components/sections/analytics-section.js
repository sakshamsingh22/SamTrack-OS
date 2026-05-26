import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "../ui/chart-card";

const PIE_COLORS = ["#0f766e", "#cbd5e1"];

export default function AnalyticsSection({
  theme,
  consistencyData,
  weeklyStats,
  monthlyStats
}) {
  const monthlyDonutData = [
    { name: "Completed", value: monthlyStats.completionPercent },
    { name: "Remaining", value: Math.max(100 - monthlyStats.completionPercent, 0) }
  ];

  return (
    <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <ChartCard
        className="min-w-0"
        eyebrow="Analytics"
        title="Weekly execution chart"
        description="Only the core weekly view stays here: how much work got finished across the last 7 days."
      >
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Weekly progress
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {weeklyStats.progressPercent}%
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {weeklyStats.totalActions}/{weeklyStats.goal} actions
          </div>
        </div>
        <div className="relative h-72 min-w-0 overflow-hidden pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consistencyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: theme === "dark" ? "#94a3b8" : "#475569", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: theme === "dark" ? "#94a3b8" : "#475569", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value} actions`, "Completed"]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(148, 163, 184, 0.22)",
                  background: theme === "dark" ? "#0f172a" : "#ffffff"
                }}
              />
              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                fill={theme === "dark" ? "#38bdf8" : "#0f766e"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        className="min-w-0"
        eyebrow="Monthly view"
        title="Monthly completion donut"
        description="A single summary for the month instead of a crowded analytics wall."
      >
        <div className="relative h-80 min-w-0 overflow-hidden pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={monthlyDonutData}
                dataKey="value"
                innerRadius={84}
                outerRadius={112}
                paddingAngle={4}
                strokeWidth={0}
              >
                {monthlyDonutData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Month"]}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(148, 163, 184, 0.22)",
                  background: theme === "dark" ? "#0f172a" : "#ffffff"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {monthlyStats.completionPercent}%
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              monthly completion
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
