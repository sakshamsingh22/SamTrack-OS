import Card from "../ui/card";

export default function InsightsRail({
  weeklyStats,
  heatmapCells,
  focusStreak,
  dsaStreak,
  monthlyStats
}) {
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-1">
          <div className="eyebrow">Weekly progress</div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {weeklyStats.progressPercent}% complete
          </h3>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-600"
            style={{ width: `${weeklyStats.progressPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl bg-slate-100/70 px-3 py-3 dark:bg-slate-950/45">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Actions
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
              {weeklyStats.totalActions}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-100/70 px-3 py-3 dark:bg-slate-950/45">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Goal
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
              {weeklyStats.goal}
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-1">
          <div className="eyebrow">Heatmap</div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Last 12 weeks
          </h3>
        </div>
        <div className="overflow-hidden rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-950/45">
          <div className="grid grid-flow-col grid-rows-7 gap-2">
            {heatmapCells.map((cell) => (
              <div
                key={cell.dateKey}
                title={`${cell.dateKey}: ${cell.count} actions`}
                className={`h-3.5 w-3.5 rounded-[4px] heat-${cell.level}`}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-1">
          <div className="eyebrow">Streaks</div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Momentum status
          </h3>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl border px-4 py-4 soft-divider">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Focus streak
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              {focusStreak} days
            </div>
          </div>
          <div className="rounded-2xl border px-4 py-4 soft-divider">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              DSA streak
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              {dsaStreak} days
            </div>
          </div>
          <div className="rounded-2xl border px-4 py-4 soft-divider">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Monthly consistency
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              {monthlyStats.consistencyPercent}%
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
