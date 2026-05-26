import { CheckSquare2, Code2, Flame, TrendingUp } from "lucide-react";
import Card from "../ui/card";
import StatBox from "../ui/stat-box";

export default function DashboardSection({
  profile,
  focusStreak,
  tasksCompletedToday,
  dailyDsaCount,
  weeklyStats,
  pendingTasksToday,
  pendingHabitsToday,
  remainingDsaToday,
  weeklySummary
}) {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-teal-500/12 via-sky-500/12 to-cyan-400/10" />
        <div className="relative space-y-4">
          <div className="eyebrow">Welcome back</div>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Build consistency without losing the plot.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {profile.name}, this workspace is tuned for one thing: clean daily
              execution across DSA, study, revision, and everything that keeps
              the week under control.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <StatBox
          icon={Flame}
          label="Streak"
          value={`${focusStreak}d`}
          meta="Current focus run across tracked activity."
          tone="teal"
        />
        <StatBox
          icon={CheckSquare2}
          label="Tasks completed"
          value={tasksCompletedToday}
          meta={`${pendingTasksToday} still open today.`}
          tone="green"
        />
        <StatBox
          icon={Code2}
          label="DSA solved"
          value={dailyDsaCount}
          meta={`${remainingDsaToday} left to hit today's target.`}
          tone="yellow"
        />
        <StatBox
          icon={TrendingUp}
          label="Weekly progress"
          value={`${weeklyStats.progressPercent}%`}
          meta={`${weeklyStats.totalActions}/${weeklyStats.goal} tracked actions.`}
          tone="red"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4">
          <div className="space-y-1">
            <div className="eyebrow">Today&apos;s runway</div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Close the day cleanly
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Tasks left
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                {pendingTasksToday}
              </div>
            </div>
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Habits pending
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                {pendingHabitsToday}
              </div>
            </div>
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                DSA remaining
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                {remainingDsaToday}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-1">
            <div className="eyebrow">Weekly readout</div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {weeklySummary.headline}
            </h3>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {weeklySummary.body}
          </p>
          <div className="rounded-2xl bg-slate-100/70 px-4 py-4 text-sm leading-7 text-slate-700 dark:bg-slate-950/45 dark:text-slate-200">
            {weeklySummary.suggestion}
          </div>
        </Card>
      </div>
    </div>
  );
}
