"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Code2,
  LayoutDashboard,
  ListTodo,
  ChartColumnBig,
  Settings2,
  TableProperties
} from "lucide-react";
import Sidebar from "./layout/sidebar";
import Navbar from "./layout/navbar";
import DashboardSection from "./sections/dashboard-section";
import HabitTrackerSection from "./sections/habit-tracker-section";
import TasksSection from "./sections/tasks-section";
import DsaSection from "./sections/dsa-section";
import AnalyticsSection from "./sections/analytics-section";
import SettingsSection from "./sections/settings-section";
import InsightsRail from "./sections/insights-rail";
import {
    REMINDER_INTERVAL_MS,
    addDays,
    createExportCsv,
    createId,
    createPrintReport,
    downloadTextFile,
    formatDateKey,
    formatLongDate,
    formatRelativeTime,
    getConsistencyChartData,
  getCurrentStreak,
  getDailyActivityMap,
  getDsaStreak,
  getHabitStatus,
  getHeatmapCells,
  getLongestStreak,
  getMonthGrid,
  getMonthLabel,
  getMonthlyStats,
  getNextHabitStatus,
  getProblemCountOnDate,
  getTasksForDate,
  getWeeklyStats,
  getWeeklySummary,
  resequenceItems
} from "../lib/sam-track";

const SECTIONS = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "overview",
    longDescription:
      "Your clean command center with only the essential top-line performance signals.",
    icon: LayoutDashboard
  },
  {
    id: "habits",
    label: "Habit Tracker",
    description: "monthly grid",
    longDescription:
      "A full-width monthly tracker with sticky habit labels, lighter weekly bands, and quick updates.",
    icon: TableProperties
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "daily queue",
    longDescription:
      "Add tasks on the left, reorder the work queue on the right, and keep execution friction low.",
    icon: ListTodo
  },
  {
    id: "dsa",
    label: "DSA Tracker",
    description: "problem log",
    longDescription:
      "Track solves, build momentum, and keep the problem feed feeling more like a leaderboard than a spreadsheet.",
    icon: Code2
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "weekly + monthly",
    longDescription:
      "Two charts only: one weekly execution graph and one monthly completion donut.",
    icon: ChartColumnBig
  },
  {
    id: "settings",
    label: "Settings",
    description: "controls",
    longDescription:
      "Goals, reminders, exports, and your Pomodoro timer live here so the main workspace stays clean.",
    icon: Settings2
  }
];

export default function SamTrackApp({
  data,
  saveState,
  theme,
  onThemeToggle,
  onDataChange,
  onSignOut
}) {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [taskDate, setTaskDate] = useState(todayKey);
  const [taskForm, setTaskForm] = useState({
    title: "",
    category: "Study"
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [problemForm, setProblemForm] = useState({
    name: "",
    platform: "LeetCode",
    difficulty: "Medium",
    solvedAt: todayKey
  });
  const [timerMode, setTimerMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(data.pomodoro.focusMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [syncingLeetCode, setSyncingLeetCode] = useState(false);
  const [editingLeetCodeUsername, setEditingLeetCodeUsername] = useState(false);
  const [savingLeetCodeUsername, setSavingLeetCodeUsername] = useState(false);
  const [leetcodeUsernameDraft, setLeetCodeUsernameDraft] = useState(
    data.leetcode.username
  );
  const lastReminderRef = useRef(0);
  const leetCodeSyncInFlightRef = useRef(false);
  const lastLeetCodeSyncRequestRef = useRef(0);
  const latestDataRef = useRef(data);

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!editingLeetCodeUsername) {
      setLeetCodeUsernameDraft(data.leetcode.username);
    }
  }, [data.leetcode.username, editingLeetCodeUsername]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(
      (timerMode === "focus" ? data.pomodoro.focusMinutes : data.pomodoro.breakMinutes) *
        60
    );
  }, [data.pomodoro.breakMinutes, data.pomodoro.focusMinutes, timerMode]);

  useEffect(() => {
    if (!timerRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) {
          return current - 1;
        }

        const nextMode = timerMode === "focus" ? "break" : "focus";
        setTimerRunning(false);
        setTimerMode(nextMode);

        if (notificationPermission === "granted") {
          new Notification(
            nextMode === "focus" ? "Back to deep work." : "Take a short reset.",
            {
              body:
                nextMode === "focus"
                  ? "Pomodoro reset complete."
                  : "Break mode is ready."
            }
          );
        }

        return (
          (nextMode === "focus"
            ? data.pomodoro.focusMinutes
            : data.pomodoro.breakMinutes) * 60
        );
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [
    data.pomodoro.breakMinutes,
    data.pomodoro.focusMinutes,
    notificationPermission,
    timerMode,
    timerRunning
  ]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    if (!data.remindersEnabled || notificationPermission !== "granted") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const remainingTasks = getTasksForDate(data.tasks, todayKey).filter(
        (task) => !task.completed
      ).length;
      const remainingHabits = data.habits.filter(
        (habit) => getHabitStatus(data.habitEntries, todayKey, habit.id) !== "done"
      ).length;
      const dsaGap = Math.max(
        0,
        Number(data.goals.dailyDsa) - getProblemCountOnDate(data, todayKey)
      );

      if (remainingTasks === 0 && remainingHabits === 0 && dsaGap === 0) {
        return;
      }

      if (Date.now() - lastReminderRef.current < REMINDER_INTERVAL_MS) {
        return;
      }

      new Notification("Sam Track reminder", {
        body: `${remainingTasks} tasks, ${remainingHabits} habits, ${dsaGap} DSA problems left to close today's loop.`
      });
      lastReminderRef.current = Date.now();
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [
    data,
    data.dsaProblems,
    data.goals.dailyDsa,
    data.habitEntries,
    data.habits,
    data.leetcode.submissionCalendar,
    data.remindersEnabled,
    data.tasks,
    notificationPermission,
    todayKey
  ]);

  const profile = data.profile;
  const monthGrid = getMonthGrid(monthCursor);
  const monthLabel = getMonthLabel(monthCursor);
  const tasksForSelectedDate = getTasksForDate(data.tasks, taskDate);
  const todayTasks = getTasksForDate(data.tasks, todayKey);
  const dailyActivityMap = getDailyActivityMap(data);
  const focusDates = Object.keys(dailyActivityMap).filter(
    (dateKey) => dailyActivityMap[dateKey] > 0
  );
  const focusStreak = getCurrentStreak(focusDates, today);
  const longestFocusStreak = getLongestStreak(focusDates);
  const dsaStreak = getDsaStreak(data, today);
  const weeklyStats = getWeeklyStats(data, today);
  const monthlyStats = getMonthlyStats(data, monthCursor);
  const consistencyData = getConsistencyChartData(data, 7, today);
  const heatmapCells = getHeatmapCells(data, 84, today);
  const weeklySummary = getWeeklySummary(data, today);
  const dailyDsaCount = getProblemCountOnDate(data, todayKey);
  const tasksCompletedToday = todayTasks.filter((task) => task.completed).length;
  const pendingTasksToday = todayTasks.filter((task) => !task.completed).length;
  const pendingHabitsToday = data.habits.filter(
    (habit) => getHabitStatus(data.habitEntries, todayKey, habit.id) !== "done"
  ).length;
  const remainingDsaToday = Math.max(0, data.goals.dailyDsa - dailyDsaCount);
  const currentSection = SECTIONS.find((section) => section.id === activeSection) || SECTIONS[0];
  const leetcodeActivity = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const dateKey = formatDateKey(date);
    const value = data.dsaProblems.filter(
      (problem) =>
        problem.platform === "LeetCode" && formatDateKey(problem.solvedAt) === dateKey
    ).length;
    const syncedValue = Number(data.leetcode.submissionCalendar?.[dateKey]) || 0;

    return {
      dateKey,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      value: Math.max(value, syncedValue)
    };
  });

  const updateData = useCallback((updater) => {
    onDataChange((current) => (typeof updater === "function" ? updater(current) : updater));
  }, [onDataChange]);

  function applyTaskOrder(tasks, dateKey) {
    const orderedDateTasks = resequenceItems(getTasksForDate(tasks, dateKey));
    const orderMap = new Map(orderedDateTasks.map((task) => [task.id, task.order]));

    return tasks.map((task) =>
      task.date === dateKey && orderMap.has(task.id)
        ? { ...task, order: orderMap.get(task.id) }
        : task
    );
  }

  function handleShiftMonth(direction) {
    setMonthCursor(
      (current) => new Date(current.getFullYear(), current.getMonth() + direction, 1)
    );
  }

  function handleHabitToggle(dateKey, habitId) {
    updateData((current) => {
      const nextEntries = { ...(current.habitEntries || {}) };
      const currentEntry = nextEntries[dateKey] ? { ...nextEntries[dateKey] } : {};
      const nextStatus = getNextHabitStatus(currentEntry[habitId]);

      if (nextStatus) {
        currentEntry[habitId] = nextStatus;
      } else {
        delete currentEntry[habitId];
      }

      if (Object.keys(currentEntry).length) {
        nextEntries[dateKey] = currentEntry;
      } else {
        delete nextEntries[dateKey];
      }

      return {
        ...current,
        habitEntries: nextEntries
      };
    });
  }

  function resetTaskForm() {
    setEditingTaskId(null);
    setTaskForm({
      title: "",
      category: "Study"
    });
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const title = taskForm.title.trim();

    if (!title) {
      return;
    }

    updateData((current) => {
      if (editingTaskId) {
        const existingTask = current.tasks.find((task) => task.id === editingTaskId);
        const nextOrder = getTasksForDate(
          current.tasks.filter((task) => task.id !== editingTaskId),
          taskDate
        ).length;

        let nextTasks = current.tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title,
                category: taskForm.category,
                date: taskDate,
                order: existingTask?.date === taskDate ? task.order : nextOrder
              }
            : task
        );

        if (existingTask) {
          nextTasks = applyTaskOrder(nextTasks, existingTask.date);
          nextTasks = applyTaskOrder(nextTasks, taskDate);
        }

        return {
          ...current,
          tasks: nextTasks
        };
      }

      const nextOrder = getTasksForDate(current.tasks, taskDate).length;

      return {
        ...current,
        tasks: [
          ...current.tasks,
          {
            id: createId("task"),
            title,
            category: taskForm.category,
            date: taskDate,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            order: nextOrder
          }
        ]
      };
    });

    resetTaskForm();
  }

  function handleTaskToggle(taskId) {
    updateData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed ? null : new Date().toISOString()
            }
          : task
      )
    }));
  }

  function handleTaskEdit(task) {
    setActiveSection("tasks");
    setEditingTaskId(task.id);
    setTaskDate(task.date);
    setTaskForm({
      title: task.title,
      category: task.category
    });
  }

  function handleTaskDelete(taskId) {
    updateData((current) => {
      const taskToDelete = current.tasks.find((task) => task.id === taskId);
      const nextTasks = current.tasks.filter((task) => task.id !== taskId);

      return {
        ...current,
        tasks: taskToDelete ? applyTaskOrder(nextTasks, taskToDelete.date) : nextTasks
      };
    });

    if (editingTaskId === taskId) {
      resetTaskForm();
    }
  }

  function handleTaskReorder(reorderedTasks) {
    updateData((current) => {
      const orderedTasks = resequenceItems(reorderedTasks);
      const orderMap = new Map(orderedTasks.map((task) => [task.id, task.order]));

      return {
        ...current,
        tasks: current.tasks.map((task) =>
          task.date === taskDate && orderMap.has(task.id)
            ? { ...task, order: orderMap.get(task.id) }
            : task
        )
      };
    });
  }

  function handleProblemSubmit(event) {
    event.preventDefault();
    const name = problemForm.name.trim();

    if (!name) {
      return;
    }

    updateData((current) => ({
      ...current,
      dsaProblems: [
        {
          id: createId("dsa"),
          name,
          platform: problemForm.platform,
          difficulty: problemForm.difficulty,
          solvedAt: new Date(`${problemForm.solvedAt}T12:00:00`).toISOString()
        },
        ...current.dsaProblems
      ]
    }));

    setProblemForm({
      name: "",
      platform: problemForm.platform,
      difficulty: problemForm.difficulty,
      solvedAt: todayKey
    });
  }

  function handleProblemDelete(problemId) {
    updateData((current) => ({
      ...current,
      dsaProblems: current.dsaProblems.filter((problem) => problem.id !== problemId)
    }));
  }

  function handleLeetCodeFieldChange(field, rawValue) {
    const nextValue =
      field === "autoSyncMinutes"
        ? Math.min(60, Math.max(2, Number(rawValue) || 5))
        : rawValue;

    updateData((current) => ({
      ...current,
      leetcode: {
        ...current.leetcode,
        [field]: nextValue,
        error: field === "username" ? "" : current.leetcode.error
      }
    }));
  }

  function handleLeetCodeToggle() {
    const nextEnabled = !data.leetcode.syncEnabled;

    updateData((current) => ({
      ...current,
      leetcode: {
        ...current.leetcode,
        syncEnabled: nextEnabled,
        syncStatus: nextEnabled ? current.leetcode.syncStatus : "idle",
        error:
          nextEnabled || !current.leetcode.error
            ? current.leetcode.error
            : ""
      }
    }));

    if (nextEnabled && !data.leetcode.username.trim()) {
      setNotice("Add your LeetCode username before enabling sync.");
    } else {
      setNotice(nextEnabled ? "LeetCode sync enabled." : "LeetCode sync paused.");
    }
  }

  function handleStartLeetCodeUsernameEdit() {
    setLeetCodeUsernameDraft(latestDataRef.current.leetcode.username);
    setEditingLeetCodeUsername(true);
  }

  function handleCancelLeetCodeUsernameEdit() {
    setLeetCodeUsernameDraft(latestDataRef.current.leetcode.username);
    setEditingLeetCodeUsername(false);
  }

  const syncLeetCode = useCallback(async ({ manual = false, usernameOverride } = {}) => {
    const username = String(
      usernameOverride ?? latestDataRef.current.leetcode.username
    ).trim();
    const savedUsername = latestDataRef.current.profile.leetcodeUsername.trim();
    const lastUpdatedAt = latestDataRef.current.leetcode.lastUpdatedAt;
    const startedAt = Date.now();

    if (!username || leetCodeSyncInFlightRef.current) {
      return {
        ok: false
      };
    }

    if (!manual && startedAt - lastLeetCodeSyncRequestRef.current < 10 * 1000) {
      return {
        ok: false,
        skipped: "debounced"
      };
    }

    lastLeetCodeSyncRequestRef.current = startedAt;
    console.info("[leetcode-sync] sync started", {
      username,
      manual
    });

    leetCodeSyncInFlightRef.current = true;
    setSyncingLeetCode(true);

    updateData((current) => ({
      ...current,
      leetcode: {
        ...current.leetcode,
        syncStatus: "syncing",
        error: ""
      }
    }));

    try {
      const response = await fetch(`/api/leetcode/${encodeURIComponent(username)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentUsername: savedUsername,
          lastUpdatedAt,
          force: manual
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to sync LeetCode right now.");
      }

      updateData((current) => {
        const existingProblemKeys = new Set(
          current.dsaProblems.map((problem) =>
            String(problem.problemId || problem.submissionId || problem.titleSlug || problem.id)
          )
        );
        const existingTitleSlugs = new Set(
          current.dsaProblems
            .map((problem) => String(problem.titleSlug || "").trim().toLowerCase())
            .filter(Boolean)
        );
        const nextSyncedAt = payload.syncedAt || new Date().toISOString();
        const newProblems = (payload.recentSubmissions || [])
          .filter((submission) => {
            const submissionKey = String(submission.problemId || submission.submissionId || submission.id);
            const normalizedSlug = String(submission.titleSlug || "").trim().toLowerCase();

            return !existingProblemKeys.has(submissionKey) && !existingTitleSlugs.has(normalizedSlug);
          })
          .map((submission) => ({
            id: createId("dsa"),
            problemId: String(submission.problemId || submission.id),
            submissionId: String(submission.submissionId || submission.id),
            name: submission.title,
            platform: "LeetCode",
            difficulty: submission.difficulty || "Unknown",
            solvedAt: submission.solvedAt,
            titleSlug: submission.titleSlug,
            url: submission.url,
            source: "leetcode",
            leetcodeUsername: payload.username,
            language: submission.language || null,
            runtime: submission.runtime || null,
            syncedAt: nextSyncedAt,
            syncedFromLeetCode: true
          }));
        const skippedDuplicates = Math.max(
          0,
          (payload.recentSubmissions || []).length - newProblems.length
        );
        const nextData = {
          ...current,
          profile: {
            ...current.profile,
            leetcodeUsername: payload.username
          },
          leetcode: {
            ...current.leetcode,
            username: payload.username,
            lastUpdatedAt: payload.lastUpdatedAt,
            syncStatus: "connected",
            error: "",
            lastSyncedAt: nextSyncedAt,
            totalSolved: payload.totalSolved,
            submissionCalendar: payload.submissionCalendar || {},
            breakdown: payload.breakdown,
            recentSubmissions: payload.recentSubmissions || []
          },
          dsaProblems: [...newProblems, ...current.dsaProblems].sort(
            (left, right) =>
              new Date(right.solvedAt).getTime() - new Date(left.solvedAt).getTime()
          )
        };

        console.info("[leetcode-sync] merge result", {
          username: payload.username,
          insertedNewProblems: newProblems.length,
          skippedDuplicates,
          streakRecalculated: getDsaStreak(nextData, new Date()),
          todayCount: getProblemCountOnDate(nextData, formatDateKey(new Date())),
          fetchedSubmissions: (payload.recentSubmissions || []).length
        });

        return nextData;
      });

      if (manual) {
        setNotice(
          payload.recentSubmissions?.length
            ? "LeetCode synced and tracker updated."
            : "LeetCode synced. No recent accepted submissions were found."
        );
      }

      console.info("[leetcode-sync] sync completed", {
        username: payload.username,
        fetchedSubmissions: (payload.recentSubmissions || []).length
      });

      return {
        ok: true,
        username: payload.username
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sync LeetCode.";

      updateData((current) => ({
        ...current,
        leetcode: {
          ...current.leetcode,
          syncStatus: "failed",
          error: message
        }
      }));

      if (manual) {
        setNotice(message);
      }

      console.error("[leetcode-sync] sync failed", {
        username,
        message
      });

      return {
        ok: false,
        error: message
      };
    } finally {
      leetCodeSyncInFlightRef.current = false;
      setSyncingLeetCode(false);
    }
  }, [updateData]);

  async function handleSaveLeetCodeUsername() {
    const nextUsername = leetcodeUsernameDraft.trim();

    if (!nextUsername) {
      setNotice("LeetCode username is required.");
      return;
    }

    if (nextUsername === data.leetcode.username.trim()) {
      setEditingLeetCodeUsername(false);
      return;
    }

    setSavingLeetCodeUsername(true);
    const result = await syncLeetCode({
      manual: true,
      usernameOverride: nextUsername
    });
    setSavingLeetCodeUsername(false);

    if (result?.ok) {
      setEditingLeetCodeUsername(false);
    }
  }

  function handleGoalChange(field, rawValue) {
    const nextValue = Math.min(200, Math.max(1, Number(rawValue) || 1));

    updateData((current) => ({
      ...current,
      goals: {
        ...current.goals,
        [field]: nextValue
      }
    }));
  }

  function handlePomodoroChange(field, rawValue) {
    const nextValue = Math.min(90, Math.max(1, Number(rawValue) || 1));

    updateData((current) => ({
      ...current,
      pomodoro: {
        ...current.pomodoro,
        [field]: nextValue
      }
    }));
  }

  async function handleReminderToggle() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotice("Notifications are not supported in this browser.");
      return;
    }

    if (data.remindersEnabled) {
      updateData((current) => ({
        ...current,
        remindersEnabled: false
      }));
      setNotice("Reminders paused.");
      return;
    }

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }

    if (permission !== "granted") {
      setNotice("Notification permission was not granted.");
      return;
    }

    updateData((current) => ({
      ...current,
      remindersEnabled: true
    }));
    setNotice("Reminders enabled.");
  }

  function handleCsvExport() {
    const filename = `sam-track-${profile.name.toLowerCase().replace(/\s+/g, "-")}.csv`;
    downloadTextFile(filename, createExportCsv(data), "text/csv;charset=utf-8");
    setNotice("CSV exported.");
  }

  function handlePdfExport() {
    const reportWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!reportWindow) {
      setNotice("Enable pop-ups to open the PDF export view.");
      return;
    }

    reportWindow.document.write(
      createPrintReport({
        profile,
        weeklyStats,
        monthlyStats,
        focusStreak,
        longestFocusStreak,
        todayScore: dailyActivityMap[todayKey] || 0,
        quote: {
          text: "Consistency is easier to trust when the interface stays quiet.",
          author: "Sam Track"
        },
        generatedAt: today
      })
    );
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
    setNotice("PDF report opened in a new tab.");
  }

  useEffect(() => {
    if (!data.leetcode.syncEnabled || !data.leetcode.username.trim()) {
      return undefined;
    }

    syncLeetCode();

    const intervalId = window.setInterval(() => {
      syncLeetCode();
    }, Math.max(2, Number(data.leetcode.autoSyncMinutes) || 5) * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [
    data.leetcode.autoSyncMinutes,
    data.leetcode.syncEnabled,
    data.leetcode.username,
    syncLeetCode
  ]);

  function renderSection() {
    if (activeSection === "habits") {
      return (
        <HabitTrackerSection
          monthGrid={monthGrid}
          monthLabel={monthLabel}
          habits={data.habits}
          habitEntries={data.habitEntries}
          onShiftMonth={handleShiftMonth}
          onToggleHabit={handleHabitToggle}
          getHabitStatus={getHabitStatus}
        />
      );
    }

    if (activeSection === "tasks") {
      return (
        <TasksSection
          taskDate={taskDate}
          taskForm={taskForm}
          editingTaskId={editingTaskId}
          tasksForSelectedDate={tasksForSelectedDate}
          setTaskDate={setTaskDate}
          setTaskForm={setTaskForm}
          onSubmit={handleTaskSubmit}
          onCancelEdit={resetTaskForm}
          onToggleTask={handleTaskToggle}
          onEditTask={handleTaskEdit}
          onDeleteTask={handleTaskDelete}
          onReorderTasks={handleTaskReorder}
          formatLongDate={formatLongDate}
        />
      );
    }

    if (activeSection === "dsa") {
      return (
        <DsaSection
          problemForm={problemForm}
          setProblemForm={setProblemForm}
          onSubmit={handleProblemSubmit}
          onDeleteProblem={handleProblemDelete}
          dsaProblems={data.dsaProblems}
          dailyDsaCount={dailyDsaCount}
          dailyGoal={data.goals.dailyDsa}
          dsaStreak={dsaStreak}
          leetcode={data.leetcode}
          editingLeetCodeUsername={editingLeetCodeUsername}
          savingLeetCodeUsername={savingLeetCodeUsername}
          leetcodeUsernameDraft={leetcodeUsernameDraft}
          syncingLeetCode={syncingLeetCode}
          leetcodeActivity={leetcodeActivity}
          onLeetCodeUsernameDraftChange={setLeetCodeUsernameDraft}
          onStartLeetCodeUsernameEdit={handleStartLeetCodeUsernameEdit}
          onCancelLeetCodeUsernameEdit={handleCancelLeetCodeUsernameEdit}
          onSaveLeetCodeUsername={handleSaveLeetCodeUsername}
          onLeetCodeFieldChange={handleLeetCodeFieldChange}
          onLeetCodeToggle={handleLeetCodeToggle}
          onLeetCodeSync={() => syncLeetCode({ manual: true })}
          formatLongDate={formatLongDate}
          formatRelativeTime={formatRelativeTime}
        />
      );
    }

    if (activeSection === "analytics") {
      return (
        <AnalyticsSection
          theme={theme}
          consistencyData={consistencyData}
          weeklyStats={weeklyStats}
          monthlyStats={monthlyStats}
        />
      );
    }

    if (activeSection === "settings") {
      return (
        <SettingsSection
          profile={profile}
          theme={theme}
          remindersEnabled={data.remindersEnabled}
          goals={data.goals}
          pomodoro={data.pomodoro}
          timerMode={timerMode}
          secondsLeft={secondsLeft}
          timerRunning={timerRunning}
          onThemeToggle={onThemeToggle}
          onReminderToggle={handleReminderToggle}
          onGoalChange={handleGoalChange}
          onPomodoroChange={handlePomodoroChange}
          onTimerToggle={() => setTimerRunning((current) => !current)}
          onTimerReset={() => {
            setTimerRunning(false);
            setSecondsLeft(
              (timerMode === "focus"
                ? data.pomodoro.focusMinutes
                : data.pomodoro.breakMinutes) * 60
            );
          }}
          onCsvExport={handleCsvExport}
          onPdfExport={handlePdfExport}
        />
      );
    }

    return (
      <DashboardSection
        profile={profile}
        focusStreak={focusStreak}
        tasksCompletedToday={tasksCompletedToday}
        dailyDsaCount={dailyDsaCount}
        weeklyStats={weeklyStats}
        pendingTasksToday={pendingTasksToday}
        pendingHabitsToday={pendingHabitsToday}
        remainingDsaToday={remainingDsaToday}
        weeklySummary={weeklySummary}
      />
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)_320px]">
        <Sidebar
          sections={SECTIONS}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          profile={profile}
        />

        <div className="min-w-0 space-y-8">
          <Navbar
            section={currentSection}
            saveState={saveState}
            theme={theme}
            remindersEnabled={data.remindersEnabled}
            onThemeToggle={onThemeToggle}
            onReminderToggle={handleReminderToggle}
            onSignOut={onSignOut}
          />

          <AnimatePresence>
            {notice ? (
              <motion.div
                key={notice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-700 dark:text-teal-300"
              >
                {notice}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.section
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-8"
            >
              {renderSection()}
            </motion.section>
          </AnimatePresence>
        </div>

        <div className="min-w-0">
          <div className="space-y-4 xl:sticky xl:top-6">
            <InsightsRail
              weeklyStats={weeklyStats}
              heatmapCells={heatmapCells}
              focusStreak={focusStreak}
              dsaStreak={dsaStreak}
              monthlyStats={monthlyStats}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
