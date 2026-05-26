import { ChevronLeft, ChevronRight } from "lucide-react";
import Card, { CardHeader } from "../ui/card";
import GridCell from "../ui/grid-cell";

export default function HabitTrackerSection({
  monthGrid,
  monthLabel,
  habits,
  habitEntries,
  onShiftMonth,
  onToggleHabit,
  getHabitStatus
}) {
  return (
    <Card className="space-y-6">
      <CardHeader
        eyebrow="Habit tracker"
        title="Monthly consistency grid"
        description="One wide canvas, sticky habit labels, and subtle weekly bands so the pattern reads fast."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShiftMonth(-1)}
              className="btn-secondary h-10 w-10 px-0"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="rounded-2xl border px-4 py-2 text-sm font-medium soft-divider">
              {monthLabel}
            </div>
            <button
              type="button"
              onClick={() => onShiftMonth(1)}
              className="btn-secondary h-10 w-10 px-0"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-emerald-700 dark:text-emerald-300">
          Done
        </span>
        <span className="rounded-full bg-rose-500/12 px-3 py-1 text-rose-700 dark:text-rose-300">
          Missed
        </span>
        <span className="rounded-full bg-slate-200/60 px-3 py-1 dark:bg-slate-900/80">
          Hover or tap to update
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1120px] border-separate border-spacing-2 text-center">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-[210px] rounded-2xl bg-white/95 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:bg-slate-950/90 dark:text-slate-400">
                Habit
              </th>
              {monthGrid.map((day) => (
                <th
                  key={`day-${day.dayNumber}`}
                  className={`min-w-[48px] rounded-2xl px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300 ${
                    day.disabled
                      ? "bg-slate-100/70 dark:bg-slate-900/60"
                      : `week-band-${day.weekIndex}`
                  }`}
                >
                  <div>{day.dayNumber}</div>
                  <div className="mt-1 text-[10px]">
                    {day.disabled ? "-" : day.weekday}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const monthlyCompleted = monthGrid.filter(
                (day) =>
                  !day.disabled &&
                  getHabitStatus(habitEntries, day.dateKey, habit.id) === "done"
              ).length;
              const validDays = monthGrid.filter((day) => !day.disabled).length;

              return (
                <tr key={habit.id}>
                  <td className="sticky left-0 z-10 rounded-2xl bg-white/95 px-4 py-3 text-left dark:bg-slate-950/90">
                    <div className="font-medium text-slate-950 dark:text-white">
                      {habit.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {Math.round((monthlyCompleted / Math.max(1, validDays)) * 100)}%
                      done this month
                    </div>
                  </td>
                  {monthGrid.map((day) => {
                    const status = day.disabled
                      ? undefined
                      : getHabitStatus(habitEntries, day.dateKey, habit.id);

                    return (
                      <td key={`${habit.id}-${day.dayNumber}`}>
                        <GridCell
                          disabled={day.disabled}
                          status={status}
                          weekIndex={day.weekIndex}
                          onClick={() => onToggleHabit(day.dateKey, habit.id)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
