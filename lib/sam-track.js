export const AUTH_STORAGE_KEY = "sam-track-auth";
export const USERS_STORAGE_KEY = "sam-track-users";
export const THEME_STORAGE_KEY = "sam-track-theme";
export const REMINDER_INTERVAL_MS = 45 * 60 * 1000;

export const CATEGORY_OPTIONS = ["Study", "DSA", "Revision", "Personal"];
export const PLATFORM_OPTIONS = [
  "LeetCode",
  "Codeforces",
  "CodeChef",
  "AtCoder",
  "GeeksforGeeks",
  "Other"
];
export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

export const DEFAULT_HABITS = [
  { id: "study", name: "Study", tone: "emerald" },
  { id: "dsa", name: "DSA", tone: "sky" },
  { id: "revision", name: "Revision", tone: "amber" },
  { id: "gym", name: "Gym", tone: "rose" }
];

export const QUOTES = [
  {
    text: "Small steps compound into visible dominance.",
    author: "Sam Track"
  },
  {
    text: "Consistency is the cheat code that looks boring until it wins.",
    author: "Daily reminder"
  },
  {
    text: "Your edge is built on the days you wanted to skip.",
    author: "Deep work note"
  },
  {
    text: "Solve one more problem before the mood changes.",
    author: "DSA sprint"
  },
  {
    text: "A calm plan beats random intensity every week.",
    author: "Study system"
  }
];

export const AI_QUICK_ACTIONS = [
  {
    id: "plan-day",
    label: "Plan my day",
    prompt:
      "Plan my day based on my current study load, pending work, and goals. Give me a realistic order for today."
  },
  {
    id: "weekly-review",
    label: "Weekly review",
    prompt:
      "Review my current week and tell me what is going well, what is slipping, and what I should fix next."
  },
  {
    id: "suggest-tasks",
    label: "Suggest tasks",
    prompt:
      "Suggest the next best tasks I should work on today based on my weak areas and pending progress."
  },
  {
    id: "dsa-recommendations",
    label: "DSA recommendations",
    prompt:
      "Recommend DSA practice for today based on my streak, recent solves, and weak areas."
  }
];

export function createId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function addDays(value, amount) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

export function startOfWeek(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  const currentDay = date.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfWeek(value) {
  const date = startOfWeek(value);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function getDaysInMonth(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getMonthLabel(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatLongDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function formatMonthDay(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

export function getMonthGrid(referenceDate) {
  const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const daysInMonth = getDaysInMonth(date);

  return Array.from({ length: 31 }, (_, index) => {
    const dayNumber = index + 1;
    const weekIndex = Math.floor(index / 7);

    if (dayNumber > daysInMonth) {
      return {
        dayNumber,
        disabled: true,
        weekIndex
      };
    }

    const current = new Date(date.getFullYear(), date.getMonth(), dayNumber, 12);
    return {
      dayNumber,
      disabled: false,
      weekIndex,
      weekday: new Intl.DateTimeFormat("en-US", {
        weekday: "short"
      })
        .format(current)
        .slice(0, 1),
      dateKey: formatDateKey(current),
      isWeekend: current.getDay() === 0 || current.getDay() === 6
    };
  });
}

export function getDataStorageKey(email) {
  return `sam-track-data:${email.toLowerCase()}`;
}

export function createInitialData(profile) {
  return {
    profile: {
      name: profile.name,
      email: profile.email.toLowerCase(),
      focusArea: profile.focusArea || "Coding, DSA, and academic consistency",
      leetcodeUsername: profile.leetcodeUsername || ""
    },
    habits: DEFAULT_HABITS,
    habitEntries: {},
    tasks: [],
    dsaProblems: [],
    goals: {
      dailyDsa: 3,
      weeklyActions: 24
    },
    pomodoro: {
      focusMinutes: 25,
      breakMinutes: 5
    },
    leetcode: {
      username: "",
      lastUpdatedAt: null,
      syncEnabled: false,
      autoSyncMinutes: 5,
      lastSyncedAt: null,
      syncStatus: "idle",
      error: "",
      totalSolved: 0,
      submissionCalendar: {},
      breakdown: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      recentSubmissions: []
    },
    aiCoach: {
      weakSubjects: "",
      messages: []
    },
    remindersEnabled: false,
    createdAt: new Date().toISOString()
  };
}

export function normalizeData(storedData, profile) {
  const base = createInitialData(profile);
  const taskOrderCounts = {};
  const normalizedTasks = Array.isArray(storedData?.tasks)
    ? storedData.tasks.map((task) => {
        const nextOrder = Number.isFinite(task.order)
          ? task.order
          : (taskOrderCounts[task.date] || 0);
        taskOrderCounts[task.date] = nextOrder + 1;

        return {
          ...task,
          order: nextOrder
        };
      })
    : [];

  return {
    ...base,
    ...storedData,
    profile: {
      ...base.profile,
      ...(storedData?.profile || {}),
      ...profile,
      email: profile.email.toLowerCase()
    },
    habits: Array.isArray(storedData?.habits) && storedData.habits.length
      ? storedData.habits
      : base.habits,
    habitEntries: storedData?.habitEntries || {},
    tasks: normalizedTasks,
    dsaProblems: Array.isArray(storedData?.dsaProblems)
      ? storedData.dsaProblems
      : [],
    goals: {
      ...base.goals,
      ...(storedData?.goals || {})
    },
    pomodoro: {
      ...base.pomodoro,
      ...(storedData?.pomodoro || {})
    },
    leetcode: {
      ...base.leetcode,
      ...(storedData?.leetcode || {}),
      username:
        storedData?.leetcode?.username ||
        storedData?.profile?.leetcodeUsername ||
        profile.leetcodeUsername ||
        "",
      breakdown: {
        ...base.leetcode.breakdown,
        ...(storedData?.leetcode?.breakdown || {})
      },
      submissionCalendar: normalizeLeetCodeSubmissionCalendar(
        storedData?.leetcode?.submissionCalendar
      ),
      recentSubmissions: Array.isArray(storedData?.leetcode?.recentSubmissions)
        ? storedData.leetcode.recentSubmissions
        : []
    },
    aiCoach: {
      ...base.aiCoach,
      ...(storedData?.aiCoach || {}),
      messages: Array.isArray(storedData?.aiCoach?.messages)
        ? storedData.aiCoach.messages
        : []
    },
    remindersEnabled: Boolean(storedData?.remindersEnabled)
  };
}

export function getHabitStatus(habitEntries, dateKey, habitId) {
  return habitEntries?.[dateKey]?.[habitId];
}

export function getNextHabitStatus(status) {
  if (status === "done") {
    return "missed";
  }

  if (status === "missed") {
    return undefined;
  }

  return "done";
}

export function getTasksForDate(tasks, dateKey) {
  return tasks
    .filter((task) => task.date === dateKey)
    .sort((left, right) => {
      const leftOrder = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
}

export function resequenceItems(items) {
  return items.map((item, index) => ({
    ...item,
    order: index
  }));
}

export function getProblemCountOnDate(problems, dateKey) {
  if (!Array.isArray(problems)) {
    return getDsaCountByDateMap(problems)?.[dateKey] || 0;
  }

  return problems.filter((problem) => formatDateKey(problem.solvedAt) === dateKey).length;
}

export function parseWeakSubjects(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeLeetCodeSubmissionCalendar(calendar) {
  if (!calendar || typeof calendar !== "object" || Array.isArray(calendar)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(calendar)
      .map(([dateKey, count]) => [dateKey, Number(count) || 0])
      .filter(([dateKey, count]) => Boolean(dateKey) && count > 0)
  );
}

export function getDsaCountByDateMap(data) {
  const localLeetCodeCounts = {};
  const nonLeetCodeCounts = {};

  (data?.dsaProblems || []).forEach((problem) => {
    const solvedKey = formatDateKey(problem.solvedAt);
    const isLeetCodeProblem = problem.platform === "LeetCode";
    const target = isLeetCodeProblem ? localLeetCodeCounts : nonLeetCodeCounts;
    target[solvedKey] = (target[solvedKey] || 0) + 1;
  });

  const mergedCounts = { ...nonLeetCodeCounts };
  const submissionCalendar = normalizeLeetCodeSubmissionCalendar(
    data?.leetcode?.submissionCalendar
  );
  const leetCodeDateKeys = new Set([
    ...Object.keys(localLeetCodeCounts),
    ...Object.keys(submissionCalendar)
  ]);

  leetCodeDateKeys.forEach((dateKey) => {
    const localCount = localLeetCodeCounts[dateKey] || 0;
    const syncedCount = submissionCalendar[dateKey] || 0;
    mergedCounts[dateKey] = (mergedCounts[dateKey] || 0) + Math.max(localCount, syncedCount);
  });

  return mergedCounts;
}

export function formatRelativeTime(value, referenceDate = new Date()) {
  if (!value) {
    return "Never";
  }

  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.max(
    0,
    Math.floor((referenceDate.getTime() - date.getTime()) / 1000)
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function getDailyActivityMap(data) {
  const counts = {};

  Object.entries(data.habitEntries || {}).forEach(([dateKey, entries]) => {
    const completed = Object.values(entries || {}).filter(
      (status) => status === "done"
    ).length;

    if (completed > 0) {
      counts[dateKey] = (counts[dateKey] || 0) + completed;
    }
  });

  (data.tasks || []).forEach((task) => {
    if (!task.completed) {
      return;
    }

    const completedKey = task.completedAt ? formatDateKey(task.completedAt) : task.date;
    counts[completedKey] = (counts[completedKey] || 0) + 1;
  });

  Object.entries(getDsaCountByDateMap(data)).forEach(([dateKey, count]) => {
    counts[dateKey] = (counts[dateKey] || 0) + count;
  });

  return counts;
}

function getUniqueSortedDateKeys(dateKeys) {
  return [...new Set(dateKeys)].sort((left, right) =>
    parseDateKey(left).getTime() - parseDateKey(right).getTime()
  );
}

export function getCurrentStreak(dateKeys, referenceDate = new Date()) {
  const available = new Set(getUniqueSortedDateKeys(dateKeys));
  let cursor = referenceDate instanceof Date ? new Date(referenceDate) : new Date(referenceDate);
  cursor.setHours(0, 0, 0, 0);

  if (!available.has(formatDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  while (available.has(formatDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getLongestStreak(dateKeys) {
  const unique = getUniqueSortedDateKeys(dateKeys);

  if (!unique.length) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < unique.length; index += 1) {
    const previous = parseDateKey(unique[index - 1]);
    const next = parseDateKey(unique[index]);
    const difference = Math.round(
      (next.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (difference === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function getDsaStreak(problems, referenceDate = new Date()) {
  if (!Array.isArray(problems)) {
    return getCurrentStreak(Object.keys(getDsaCountByDateMap(problems)), referenceDate);
  }

  return getCurrentStreak(
    problems.map((problem) => formatDateKey(problem.solvedAt)),
    referenceDate
  );
}

export function isDateWithinRange(dateKey, startDate, endDate) {
  const date = parseDateKey(dateKey);
  return date >= startDate && date <= endDate;
}

export function getWeeklyStats(data, referenceDate = new Date()) {
  const startDate = startOfWeek(referenceDate);
  const endDate = endOfWeek(referenceDate);
  const activityMap = getDailyActivityMap(data);
  const activeDays = Object.keys(activityMap).filter((dateKey) =>
    isDateWithinRange(dateKey, startDate, endDate)
  ).length;

  let completedHabits = 0;
  Object.entries(data.habitEntries || {}).forEach(([dateKey, entries]) => {
    if (!isDateWithinRange(dateKey, startDate, endDate)) {
      return;
    }

    completedHabits += Object.values(entries).filter((value) => value === "done").length;
  });

  const completedTasks = (data.tasks || []).filter((task) => {
    if (!task.completed) {
      return false;
    }

    const dateKey = task.completedAt ? formatDateKey(task.completedAt) : task.date;
    return isDateWithinRange(dateKey, startDate, endDate);
  }).length;

  const dsaSolved = Object.entries(getDsaCountByDateMap(data)).reduce(
    (total, [dateKey, count]) =>
      isDateWithinRange(dateKey, startDate, endDate) ? total + count : total,
    0
  );

  const totalActions = completedHabits + completedTasks + dsaSolved;
  const goal = Math.max(1, Number(data.goals?.weeklyActions) || 1);
  const progressPercent = Math.min(100, Math.round((totalActions / goal) * 100));

  return {
    startDate,
    endDate,
    completedHabits,
    completedTasks,
    dsaSolved,
    totalActions,
    activeDays,
    goal,
    progressPercent
  };
}

export function getMonthlyStats(data, referenceDate = new Date()) {
  const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth();
  const totalDays = getDaysInMonth(date);
  const effectiveDays = isCurrentMonth ? today.getDate() : totalDays;
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const monthEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    totalDays,
    23,
    59,
    59,
    999
  );

  let completedHabits = 0;
  Object.entries(data.habitEntries || {}).forEach(([dateKey, entries]) => {
    if (!isDateWithinRange(dateKey, monthStart, monthEnd)) {
      return;
    }

    completedHabits += Object.values(entries).filter((value) => value === "done").length;
  });

  const possibleHabits = (data.habits?.length || 0) * Math.max(1, effectiveDays);
  const habitCompletionPercent = possibleHabits
    ? Math.round((completedHabits / possibleHabits) * 100)
    : 0;

  const monthlyTasks = (data.tasks || []).filter((task) =>
    isDateWithinRange(task.date, monthStart, monthEnd)
  );
  const completedTasks = monthlyTasks.filter((task) => task.completed).length;
  const taskCompletionPercent = monthlyTasks.length
    ? Math.round((completedTasks / monthlyTasks.length) * 100)
    : 100;

  const monthlyProblems = Object.entries(getDsaCountByDateMap(data)).reduce(
    (total, [dateKey, count]) =>
      isDateWithinRange(dateKey, monthStart, monthEnd) ? total + count : total,
    0
  );
  const dsaTarget = Math.max(1, effectiveDays) * Math.max(1, Number(data.goals?.dailyDsa) || 1);
  const dsaGoalPercent = Math.min(100, Math.round((monthlyProblems / dsaTarget) * 100));

  const activityMap = getDailyActivityMap(data);
  const activeDays = Object.keys(activityMap).filter((dateKey) =>
    isDateWithinRange(dateKey, monthStart, monthEnd)
  ).length;
  const consistencyPercent = Math.round((activeDays / Math.max(1, effectiveDays)) * 100);

  return {
    monthStart,
    monthEnd,
    completedHabits,
    monthlyProblems,
    completedTasks,
    activeDays,
    habitCompletionPercent,
    taskCompletionPercent,
    dsaGoalPercent,
    consistencyPercent,
    completionPercent: Math.round(
      (habitCompletionPercent + taskCompletionPercent + dsaGoalPercent) / 3
    )
  };
}

export function getConsistencyChartData(data, days = 7, referenceDate = new Date()) {
  const activityMap = getDailyActivityMap(data);
  const points = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = addDays(referenceDate, -index);
    const dateKey = formatDateKey(date);

    points.push({
      dateKey,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      value: activityMap[dateKey] || 0,
      fullDate: formatMonthDay(date)
    });
  }

  return points;
}

export function getWeeklyDonutData(data, referenceDate = new Date()) {
  const weeklyStats = getWeeklyStats(data, referenceDate);
  return [
    {
      name: "Done",
      value: Math.min(weeklyStats.totalActions, weeklyStats.goal)
    },
    {
      name: "Remaining",
      value: Math.max(weeklyStats.goal - weeklyStats.totalActions, 0)
    }
  ];
}

export function getHeatmapCells(data, totalDays = 84, referenceDate = new Date()) {
  const activityMap = getDailyActivityMap(data);
  const cells = [];

  for (let index = totalDays - 1; index >= 0; index -= 1) {
    const date = addDays(referenceDate, -index);
    const dateKey = formatDateKey(date);
    const count = activityMap[dateKey] || 0;

    let level = 0;
    if (count >= 1) {
      level = 1;
    }
    if (count >= 3) {
      level = 2;
    }
    if (count >= 5) {
      level = 3;
    }
    if (count >= 7) {
      level = 4;
    }

    cells.push({
      dateKey,
      count,
      level
    });
  }

  return cells;
}

export function getQuoteForDate(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), 0, 0);
  const diff = referenceDate.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
  return QUOTES[dayOfYear % QUOTES.length];
}

export function getWeeklySummary(data, referenceDate = new Date()) {
  const weeklyStats = getWeeklyStats(data, referenceDate);
  const dailyCounts = getConsistencyChartData(data, 7, referenceDate);
  const activityMap = getDailyActivityMap(data);
  const strongestDay = dailyCounts.reduce(
    (best, point) => (point.value > best.value ? point : best),
    { value: 0, label: "No peak yet" }
  );
  const focusDates = Object.keys(activityMap).filter((dateKey) => activityMap[dateKey] > 0);
  const streak = getCurrentStreak(focusDates, referenceDate);
  const strongestDaySentence = strongestDay.value
    ? `The best push came on ${strongestDay.label} with ${strongestDay.value} actions.`
    : "Start with one completed task or DSA solve to put the first bar on the chart.";

  return {
    headline:
      weeklyStats.activeDays >= 5
        ? "Strong pace this week."
        : "There is still room to tighten the routine.",
    body: `You logged ${weeklyStats.totalActions} tracked actions this week across ${weeklyStats.activeDays} active days. ${strongestDaySentence}`,
    suggestion:
      streak >= 3
        ? "Protect the streak with a short revision block and one more DSA solve."
        : "A compact study block today will restart momentum fast."
  };
}

export function createExportCsv(data) {
  const rows = [["type", "date", "title", "category", "platform", "difficulty", "status"]];

  Object.entries(data.habitEntries || {}).forEach(([dateKey, entries]) => {
    Object.entries(entries || {}).forEach(([habitId, status]) => {
      const habit = data.habits.find((item) => item.id === habitId);
      rows.push([
        "habit",
        dateKey,
        habit?.name || habitId,
        "",
        "",
        "",
        status
      ]);
    });
  });

  (data.tasks || []).forEach((task) => {
    rows.push([
      "task",
      task.date,
      task.title,
      task.category,
      "",
      "",
      task.completed ? "completed" : "open"
    ]);
  });

  (data.dsaProblems || []).forEach((problem) => {
    rows.push([
      "dsa",
      formatDateKey(problem.solvedAt),
      problem.name,
      "",
      problem.platform,
      problem.difficulty,
      "solved"
    ]);
  });

  return rows
    .map((row) =>
      row
        .map((column) => `"${String(column ?? "").replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");
}

export function getAiCoachSnapshot(data, referenceDate = new Date()) {
  const todayKey = formatDateKey(referenceDate);
  const todayTasks = getTasksForDate(data.tasks || [], todayKey);
  const weeklyStats = getWeeklyStats(data, referenceDate);
  const monthlyStats = getMonthlyStats(data, referenceDate);
  const dailyDsaSolved = getProblemCountOnDate(data, todayKey);
  const focusDates = Object.keys(getDailyActivityMap(data)).filter(
    (dateKey) => getDailyActivityMap(data)[dateKey] > 0
  );
  const pendingTasksToday = todayTasks.filter((task) => !task.completed);
  const completedTasksToday = todayTasks.filter((task) => task.completed);
  const weakSubjects = parseWeakSubjects(data.aiCoach?.weakSubjects || "");
  const recentProblems = (data.dsaProblems || []).slice(0, 5).map((problem) => ({
    name: problem.name,
    difficulty: problem.difficulty,
    platform: problem.platform,
    solvedAt: formatDateKey(problem.solvedAt)
  }));

  return {
    generatedAt: referenceDate.toISOString(),
    focusArea: data.profile?.focusArea || "",
    weakSubjects,
    streak: getCurrentStreak(focusDates, referenceDate),
    longestStreak: getLongestStreak(focusDates),
    dailyDsaSolved,
    dailyDsaGoal: Number(data.goals?.dailyDsa) || 0,
    weeklyProgress: weeklyStats.progressPercent,
    weeklyActions: weeklyStats.totalActions,
    weeklyGoal: weeklyStats.goal,
    weeklyTasksCompleted: weeklyStats.completedTasks,
    weeklyDsaSolved: weeklyStats.dsaSolved,
    monthlyCompletion: monthlyStats.completionPercent,
    monthlyConsistency: monthlyStats.consistencyPercent,
    tasksCompletedToday: completedTasksToday.length,
    tasksPendingToday: pendingTasksToday.length,
    pendingTaskTitles: pendingTasksToday.slice(0, 6).map((task) => task.title),
    recentProblems
  };
}

export function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createPrintReport({
  profile,
  weeklyStats,
  monthlyStats,
  focusStreak,
  longestFocusStreak,
  todayScore,
  quote,
  generatedAt
}) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Sam Track Report</title>
      <style>
        body {
          font-family: Inter, Arial, sans-serif;
          padding: 40px;
          color: #0f172a;
        }

        h1, h2 {
          margin: 0 0 12px;
        }

        .muted {
          color: #475569;
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .card {
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 18px;
          background: #f8fafc;
        }

        .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #64748b;
          margin-bottom: 10px;
        }

        .value {
          font-size: 30px;
          font-weight: 700;
        }

        .quote {
          border-left: 4px solid #0f766e;
          padding-left: 16px;
          margin-top: 28px;
          color: #134e4a;
        }
      </style>
    </head>
    <body>
      <h1>Sam Track</h1>
      <div class="muted">Track. Improve. Dominate.</div>
      <div class="muted">Prepared for ${escapeHtml(profile.name)} on ${escapeHtml(
        formatLongDate(generatedAt)
      )}</div>
      <div class="grid">
        <div class="card">
          <div class="label">Weekly actions</div>
          <div class="value">${weeklyStats.totalActions}</div>
          <div>${weeklyStats.progressPercent}% of weekly goal</div>
        </div>
        <div class="card">
          <div class="label">Monthly completion</div>
          <div class="value">${monthlyStats.completionPercent}%</div>
          <div>${monthlyStats.consistencyPercent}% consistency</div>
        </div>
        <div class="card">
          <div class="label">Current streak</div>
          <div class="value">${focusStreak} days</div>
          <div>Longest run: ${longestFocusStreak} days</div>
        </div>
        <div class="card">
          <div class="label">Today score</div>
          <div class="value">${todayScore}</div>
          <div>Habits, tasks, and solves completed today</div>
        </div>
      </div>
      <h2>Focus area</h2>
      <p>${escapeHtml(profile.focusArea)}</p>
      <h2>Weekly breakdown</h2>
      <p>Habits completed: ${weeklyStats.completedHabits}</p>
      <p>Tasks completed: ${weeklyStats.completedTasks}</p>
      <p>DSA solved: ${weeklyStats.dsaSolved}</p>
      <div class="quote">
        “${escapeHtml(quote.text)}”
        <div>— ${escapeHtml(quote.author)}</div>
      </div>
    </body>
  </html>`;
}

export async function hashValue(value) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );

  return Array.from(new Uint8Array(buffer))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
}
