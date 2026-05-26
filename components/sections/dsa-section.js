"use client";

import {
  ExternalLink,
  Flame,
  Pencil,
  RefreshCw,
  Plus,
  Trash2,
  Trophy
} from "lucide-react";
import Card, { CardHeader } from "../ui/card";

function difficultyClass(difficulty) {
  if (difficulty === "Unknown" || !difficulty) {
    return "bg-slate-200/70 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300";
  }
  if (difficulty === "Hard") {
    return "bg-rose-500/12 text-rose-700 dark:text-rose-300";
  }
  if (difficulty === "Medium") {
    return "bg-amber-400/16 text-amber-700 dark:text-amber-300";
  }
  return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
}

function statusClass(status) {
  if (status === "connected") {
    return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
  }
  if (status === "failed") {
    return "bg-rose-500/12 text-rose-700 dark:text-rose-300";
  }
  if (status === "syncing") {
    return "bg-sky-500/12 text-sky-700 dark:text-sky-300";
  }
  return "bg-slate-200/70 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300";
}

export default function DsaSection({
  problemForm,
  setProblemForm,
  onSubmit,
  onDeleteProblem,
  dsaProblems,
  dailyDsaCount,
  dailyGoal,
  dsaStreak,
  leetcode,
  editingLeetCodeUsername,
  savingLeetCodeUsername,
  leetcodeUsernameDraft,
  syncingLeetCode,
  leetcodeActivity,
  onLeetCodeUsernameDraftChange,
  onStartLeetCodeUsernameEdit,
  onCancelLeetCodeUsernameEdit,
  onSaveLeetCodeUsername,
  onLeetCodeFieldChange,
  onLeetCodeToggle,
  onLeetCodeSync,
  formatLongDate,
  formatRelativeTime
}) {
  const goalPercent = Math.max(0, Math.min(100, Math.round((dailyDsaCount / dailyGoal) * 100)));
  const recentTrackedProblems = dsaProblems.slice(0, 8);
  const maxLeetCodeActivity = Math.max(
    1,
    ...leetcodeActivity.map((point) => Number(point.value) || 0)
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5">
          <CardHeader
            eyebrow="LeetCode sync"
            title="Automate solved problem tracking"
            description="Connect a username, turn sync on, and Sam Track will merge newly detected accepted submissions into your DSA log."
          />

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium">
                  Enter LeetCode username
                </label>
                <div className="flex items-center gap-3">
                  {editingLeetCodeUsername ? (
                    <>
                      <button
                        type="button"
                        onClick={onSaveLeetCodeUsername}
                        disabled={savingLeetCodeUsername}
                        className="text-sm font-medium text-teal-700 transition hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-teal-300 dark:hover:text-sky-300"
                      >
                        {savingLeetCodeUsername ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={onCancelLeetCodeUsernameEdit}
                        disabled={savingLeetCodeUsername}
                        className="text-sm font-medium text-slate-500 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={onStartLeetCodeUsernameEdit}
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <input
                className="field"
                placeholder="leetcode_username"
                value={leetcodeUsernameDraft}
                readOnly={!editingLeetCodeUsername || savingLeetCodeUsername}
                onChange={(event) =>
                  onLeetCodeUsernameDraftChange(event.target.value)
                }
                onKeyDown={(event) => {
                  if (!editingLeetCodeUsername || savingLeetCodeUsername) {
                    return;
                  }

                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSaveLeetCodeUsername();
                  }

                  if (event.key === "Escape") {
                    event.preventDefault();
                    onCancelLeetCodeUsernameEdit();
                  }
                }}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Auto-sync every</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="2"
                  max="60"
                  className="field"
                  value={leetcode.autoSyncMinutes}
                  onChange={(event) =>
                    onLeetCodeFieldChange("autoSyncMinutes", event.target.value)
                  }
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">min</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border px-4 py-4 soft-divider md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-950 dark:text-white">
                Sync with LeetCode
              </div>
              <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Pull total solved counts and recent accepted submissions on load and
                at your chosen interval.
              </div>
            </div>

            <button
              type="button"
              onClick={onLeetCodeToggle}
              className={`relative inline-flex h-10 w-[86px] items-center rounded-full px-1 transition ${
                leetcode.syncEnabled
                  ? "bg-gradient-to-r from-teal-500 to-sky-600"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-700 shadow transition ${
                  leetcode.syncEnabled ? "translate-x-[44px]" : "translate-x-0"
                }`}
              >
                {leetcode.syncEnabled ? "ON" : "OFF"}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onLeetCodeSync}
              disabled={syncingLeetCode || !leetcode.username.trim()}
              className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={syncingLeetCode ? "animate-spin" : ""}
              />
              {syncingLeetCode ? "Syncing..." : "Refresh now"}
            </button>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${statusClass(
                leetcode.syncStatus
              )}`}
            >
              {leetcode.syncStatus === "connected"
                ? "Connected"
                : leetcode.syncStatus === "failed"
                  ? "Failed"
                  : leetcode.syncStatus === "syncing"
                    ? "Syncing"
                    : "Idle"}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Last synced {formatRelativeTime(leetcode.lastSyncedAt)}
            </span>
          </div>

          {leetcode.error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
              {leetcode.error}
            </div>
          ) : null}
        </Card>

        <Card className="space-y-5">
          <CardHeader
            eyebrow="LeetCode stats"
            title="Connected coding profile"
            description="Live totals and a lightweight activity view synced into your DSA tracker."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Total solved
              </div>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {leetcode.totalSolved}
              </div>
            </div>
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                DSA streak
              </div>
              <div className="mt-3 flex items-center gap-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                <Flame size={24} className="text-amber-500" />
                {dsaStreak}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-500/10 px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                Easy
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {leetcode.breakdown.easy}
              </div>
            </div>
            <div className="rounded-2xl bg-amber-400/14 px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                Medium
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {leetcode.breakdown.medium}
              </div>
            </div>
            <div className="rounded-2xl bg-rose-500/10 px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-300">
                Hard
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {leetcode.breakdown.hard}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-950 dark:text-white">
                  Daily goal progress
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Combined tracker progress after merge.
                </div>
              </div>
              <div className="flex items-center gap-2 text-2xl font-semibold text-slate-950 dark:text-white">
                <Trophy size={20} className="text-sky-500" />
                {dailyDsaCount}/{dailyGoal}
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-600"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="text-sm font-medium text-slate-950 dark:text-white">
              Last 7 days activity
            </div>
            <div className="min-h-[156px] overflow-hidden rounded-2xl border px-3 py-4 soft-divider">
              <div className="grid grid-cols-7 gap-2">
                {leetcodeActivity.map((point) => (
                  <div key={point.dateKey} className="space-y-2 text-center">
                    <div className="flex h-28 items-end justify-center overflow-hidden rounded-2xl bg-slate-100/80 px-2 py-2 dark:bg-slate-950/55">
                      <div
                        className="w-full rounded-xl bg-gradient-to-t from-teal-500 to-sky-600"
                        style={{
                          height: `${Math.max(
                            10,
                            Math.round((Math.min(point.value, maxLeetCodeActivity) / maxLeetCodeActivity) * 88)
                          )}px`
                        }}
                      />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {point.label.slice(0, 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-5">
          <CardHeader
            eyebrow="Recent submissions"
            title="Latest LeetCode accepts"
            description="Only newly detected accepted problems are merged into the tracker, with duplicates blocked."
          />

          {leetcode.recentSubmissions.length ? (
            <div className="space-y-3">
              {leetcode.recentSubmissions.slice(0, 6).map((submission) => (
                <div
                  key={submission.id}
                  className="flex flex-col gap-3 rounded-2xl border px-4 py-4 soft-divider md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-medium text-slate-950 dark:text-white">
                      {submission.title}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatLongDate(submission.solvedAt)}
                      </span>
                      {submission.difficulty ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClass(
                            submission.difficulty
                          )}`}
                        >
                          {submission.difficulty}
                        </span>
                      ) : null}
                      {submission.language ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {submission.language}
                        </span>
                      ) : null}
                      {submission.runtime ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {submission.runtime}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <a
                    href={submission.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary gap-2"
                  >
                    <ExternalLink size={15} />
                    Open
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed px-6 py-12 text-center soft-divider">
              <h3 className="text-lg font-medium text-slate-950 dark:text-white">
                No synced submissions yet
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Add a username and refresh once to pull recent accepted LeetCode
                submissions into Sam Track.
              </p>
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <CardHeader
            eyebrow="Manual fallback"
            title="Log a problem manually"
            description="Manual entry stays available, but synced LeetCode problems merge into the same DSA log automatically."
          />

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium">Problem name</label>
              <input
                className="field"
                placeholder="Longest Increasing Subsequence"
                value={problemForm.name}
                onChange={(event) =>
                  setProblemForm((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Platform</label>
                <select
                  className="field"
                  value={problemForm.platform}
                  onChange={(event) =>
                    setProblemForm((current) => ({
                      ...current,
                      platform: event.target.value
                    }))
                  }
                >
                  {["LeetCode", "Codeforces", "CodeChef", "AtCoder", "GeeksforGeeks", "Other"].map(
                    (platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Difficulty</label>
                <select
                  className="field"
                  value={problemForm.difficulty}
                  onChange={(event) =>
                    setProblemForm((current) => ({
                      ...current,
                      difficulty: event.target.value
                    }))
                  }
                >
                  {["Easy", "Medium", "Hard"].map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Solved on</label>
              <input
                type="date"
                className="field"
                value={problemForm.solvedAt}
                onChange={(event) =>
                  setProblemForm((current) => ({
                    ...current,
                    solvedAt: event.target.value
                  }))
                }
              />
            </div>

            <button type="submit" className="btn-primary gap-2">
              <Plus size={16} />
              Log problem
            </button>
          </form>
        </Card>
      </div>

      <Card className="space-y-5">
        <CardHeader
          eyebrow="Merged tracker"
          title="Recent DSA log"
          description="LeetCode sync and manual entries land in one shared tracker, so stats and streaks stay unified."
        />

        {recentTrackedProblems.length ? (
          <div className="space-y-3">
            {recentTrackedProblems.map((problem) => (
              <div
                key={problem.id}
                className="flex flex-col gap-3 rounded-2xl border px-4 py-4 soft-divider md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-medium text-slate-950 dark:text-white">
                    {problem.name}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {problem.platform}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClass(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty || "Unknown"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {formatLongDate(problem.solvedAt)}
                    </span>
                    {problem.syncedFromLeetCode ? (
                      <span className="rounded-full bg-sky-500/12 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
                        Synced
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {problem.url ? (
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary gap-2"
                    >
                      <ExternalLink size={15} />
                      Open
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onDeleteProblem(problem.id)}
                    className="btn-secondary h-10 w-10 px-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed px-6 py-12 text-center soft-divider">
            <h3 className="text-lg font-medium text-slate-950 dark:text-white">
              No tracked problems yet
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Sync LeetCode or log the first problem manually to start building the
              automated DSA history.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
