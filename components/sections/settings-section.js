"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bell,
  Clock3,
  Download,
  Expand,
  MoonStar,
  Shrink,
  SunMedium,
  TimerReset,
  X
} from "lucide-react";
import Card, { CardHeader } from "../ui/card";

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function SettingsSection({
  profile,
  theme,
  remindersEnabled,
  goals,
  pomodoro,
  timerMode,
  secondsLeft,
  timerRunning,
  onThemeToggle,
  onReminderToggle,
  onGoalChange,
  onPomodoroChange,
  onTimerToggle,
  onTimerReset,
  onCsvExport,
  onPdfExport
}) {
  const [timerFullscreen, setTimerFullscreen] = useState(false);

  useEffect(() => {
    if (!timerFullscreen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setTimerFullscreen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [timerFullscreen]);

  function closeTimerFullscreen() {
    setTimerFullscreen(false);
  }

  function handleCompactTimerToggle() {
    const shouldStart = !timerRunning;
    onTimerToggle();

    if (shouldStart) {
      setTimerFullscreen(true);
    }
  }

  function renderTimerDisplay() {
    return (
      <div className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-teal-500/10 via-white/55 to-sky-500/10 px-5 py-6 soft-divider dark:via-slate-950/25">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <div className="eyebrow">
              {timerMode === "focus" ? "Focus session" : "Break session"}
            </div>
            <div className="flex items-center gap-3 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              <Clock3 size={32} className="text-teal-600 dark:text-teal-300" />
              {formatCountdown(secondsLeft)}
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Launch a cleaner full-display focus mode when you start the timer or
              whenever you want a more distraction-free session.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleCompactTimerToggle} className="btn-primary">
              {timerRunning ? "Pause timer" : "Start timer"}
            </button>
            <button type="button" onClick={onTimerReset} className="btn-secondary gap-2">
              <TimerReset size={16} />
              Reset
            </button>
            <button
              type="button"
              onClick={() => setTimerFullscreen(true)}
              className="btn-secondary gap-2"
            >
              <Expand size={16} />
              Full display
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderFullscreenTimer() {
    return (
      <motion.section
        key="focus-mode"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed inset-0 z-[70] overflow-y-auto"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_26%),linear-gradient(180deg,rgba(244,247,251,0.98),rgba(236,242,249,0.98))] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_26%),linear-gradient(180deg,rgba(4,11,23,0.98),rgba(9,17,31,0.98))]" />
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.99 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="eyebrow">Focus mode</div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {timerMode === "focus" ? "Deep work in progress" : "Break session"}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                A clean full-display timer with the same session logic, controls, and
                automatic mode switching as the compact workspace view.
              </p>
            </div>

            <button
              type="button"
              onClick={closeTimerFullscreen}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white/86 text-slate-700 transition hover:bg-white dark:bg-slate-950/82 dark:text-slate-200 dark:hover:bg-slate-950"
              aria-label="Close focus mode"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:py-14">
            <div className="w-full max-w-4xl rounded-[36px] border bg-white/82 px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm soft-divider dark:bg-slate-950/72 dark:shadow-[0_28px_80px_rgba(2,6,23,0.45)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <div className="rounded-full border border-teal-500/15 bg-teal-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                  {timerMode === "focus" ? "Focus session" : "Break session"}
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-[clamp(4rem,13vw,8.5rem)] font-semibold leading-none tracking-[-0.05em] text-slate-950 dark:text-white">
                  <Clock3
                    size={44}
                    className="hidden text-teal-600 dark:text-teal-300 sm:block"
                  />
                  {formatCountdown(secondsLeft)}
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Press `Esc` anytime to leave focus mode. The timer keeps running even if
                  you return to the dashboard view.
                </p>

                <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <button type="button" onClick={onTimerToggle} className="btn-primary min-w-[164px]">
                    {timerRunning ? "Pause timer" : "Resume timer"}
                  </button>
                  <button
                    type="button"
                    onClick={onTimerReset}
                    className="btn-secondary min-w-[140px] gap-2"
                  >
                    <TimerReset size={16} />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={closeTimerFullscreen}
                    className="btn-secondary min-w-[164px] gap-2"
                  >
                    <Shrink size={16} />
                    Exit full display
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="space-y-5">
            <CardHeader
              eyebrow="Goals"
              title="Targets and reminders"
              description="Adjust the operating numbers without leaving the workspace."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Daily DSA goal</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={goals.dailyDsa}
                  onChange={(event) => onGoalChange("dailyDsa", event.target.value)}
                  className="field"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Weekly action goal</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={goals.weeklyActions}
                  onChange={(event) => onGoalChange("weeklyActions", event.target.value)}
                  className="field"
                />
              </div>
            </div>
            <button type="button" onClick={onReminderToggle} className="btn-secondary gap-2">
              <Bell size={16} />
              {remindersEnabled ? "Disable reminders" : "Enable reminders"}
            </button>
          </Card>

          <Card className="space-y-5">
            <CardHeader
              eyebrow="Workspace"
              title="Appearance and exports"
              description="Theme controls, account context, and lightweight export actions."
            />
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Account
              </div>
              <div className="mt-2 font-medium text-slate-950 dark:text-white">
                {profile.name}
              </div>
              <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {profile.email}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onThemeToggle} className="btn-secondary gap-2">
                {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
                {theme === "dark" ? "Switch to light" : "Switch to dark"}
              </button>
              <button type="button" onClick={onCsvExport} className="btn-secondary gap-2">
                <Download size={16} />
                Export CSV
              </button>
              <button type="button" onClick={onPdfExport} className="btn-secondary gap-2">
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </Card>
        </div>

        <Card className="space-y-5">
          <CardHeader
            eyebrow="Pomodoro"
            title="Focus timer"
            description="Keep the timer close to the settings area so the dashboard stays visually clean."
            action={
              <button
                type="button"
                onClick={() => setTimerFullscreen(true)}
                className="btn-secondary gap-2"
              >
                <Expand size={16} />
                Full display
              </button>
            }
          />
          <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="mb-2 block text-sm font-medium">Focus minutes</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  className="field"
                  value={pomodoro.focusMinutes}
                  onChange={(event) => onPomodoroChange("focusMinutes", event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Break minutes</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  className="field"
                  value={pomodoro.breakMinutes}
                  onChange={(event) => onPomodoroChange("breakMinutes", event.target.value)}
                />
              </div>
            </div>

            <div className="min-w-0">{renderTimerDisplay()}</div>
          </div>
        </Card>
      </div>

      <AnimatePresence>{timerFullscreen ? renderFullscreenTimer() : null}</AnimatePresence>
    </>
  );
}
