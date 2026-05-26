import { formatDateKey } from "../../../../lib/sam-track";

const LEETCODE_SYNC_QUERY = `
  query samTrackLeetCodeSync($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      submissionCalendar
    }
    recentAcSubmissionList(username: $username) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      runtime
    }
  }
`;

const LEETCODE_PROFILE_QUERY = `
  query samTrackLeetCodeProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      submissionCalendar
    }
  }
`;

const LEETCODE_RECENT_QUERY = `
  query samTrackLeetCodeRecent($username: String!) {
    recentAcSubmissionList(username: $username) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      runtime
    }
  }
`;

const SYNC_CACHE_TTL_MS = 60 * 1000;
const DIFFICULTY_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const syncCache = new Map();
const difficultyCache = new Map();

function normalizeUsername(value) {
  return decodeURIComponent(String(value || "")).trim();
}

function createLeetCodeLink(titleSlug) {
  return `https://leetcode.com/problems/${titleSlug}/`;
}

function getBreakdown(acSubmissionNum) {
  const counts = {
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0
  };

  (acSubmissionNum || []).forEach((item) => {
    const difficulty = String(item?.difficulty || "").toLowerCase();
    const count = Number(item?.count) || 0;

    if (difficulty === "all") {
      counts.totalSolved = count;
    }

    if (difficulty === "easy") {
      counts.easy = count;
    }

    if (difficulty === "medium") {
      counts.medium = count;
    }

    if (difficulty === "hard") {
      counts.hard = count;
    }
  });

  return counts;
}

function getCachedValue(store, key) {
  const entry = store.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

function setCachedValue(store, key, value, ttlMs) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

async function postLeetCodeGraphql(operationName, query, variables) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://leetcode.com",
      Referer: "https://leetcode.com",
      "User-Agent": "Sam-Track-LeetCode"
    },
    body: JSON.stringify({
      operationName,
      variables,
      query
    }),
    cache: "no-store"
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return {
    response,
    payload
  };
}

function buildDifficultyQuery(titleSlugs) {
  const aliases = titleSlugs.map((titleSlug, index) => ({
    alias: `q${index}`,
    titleSlug
  }));
  const query = `query samTrackDifficultyBatch { ${aliases
    .map(
      ({ alias, titleSlug }) =>
        `${alias}: question(titleSlug: "${titleSlug}") { difficulty }`
    )
    .join(" ")} }`;

  return {
    aliases,
    query
  };
}

async function fetchDifficultyMap(submissions) {
  const recentTitleSlugs = [...new Set(
    (submissions || [])
      .map((submission) => String(submission?.titleSlug || "").trim())
      .filter(Boolean)
  )];
  const difficultyMap = {};
  const missingTitleSlugs = [];

  recentTitleSlugs.forEach((titleSlug) => {
    const cachedDifficulty = getCachedValue(difficultyCache, titleSlug);

    if (cachedDifficulty) {
      difficultyMap[titleSlug] = cachedDifficulty;
      return;
    }

    missingTitleSlugs.push(titleSlug);
  });

  if (!missingTitleSlugs.length) {
    return difficultyMap;
  }

  const { aliases, query } = buildDifficultyQuery(missingTitleSlugs);
  const { response, payload } = await postLeetCodeGraphql(
    "samTrackDifficultyBatch",
    query,
    {}
  );

  if (!response.ok || payload?.errors?.length || !payload?.data) {
    console.warn("[leetcode-sync] difficulty lookup failed", {
      requested: missingTitleSlugs.length
    });
    return difficultyMap;
  }

  aliases.forEach(({ alias, titleSlug }) => {
    const difficulty = payload?.data?.[alias]?.difficulty || "Unknown";
    difficultyMap[titleSlug] = difficulty;
    setCachedValue(difficultyCache, titleSlug, difficulty, DIFFICULTY_CACHE_TTL_MS);
  });

  return difficultyMap;
}

function normalizeSubmissionCalendar(rawCalendar) {
  if (!rawCalendar) {
    return {};
  }

  let parsedCalendar = rawCalendar;

  if (typeof rawCalendar === "string") {
    try {
      parsedCalendar = JSON.parse(rawCalendar);
    } catch {
      parsedCalendar = {};
    }
  }

  if (!parsedCalendar || typeof parsedCalendar !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(parsedCalendar)
      .map(([timestamp, count]) => {
        const numericTimestamp = Number(timestamp);

        if (!Number.isFinite(numericTimestamp)) {
          return null;
        }

        return [
          formatDateKey(new Date(numericTimestamp * 1000)),
          Number(count) || 0
        ];
      })
      .filter(Boolean)
      .filter(([, count]) => count > 0)
  );
}

async function fetchRecentLeetCodeData(username) {
  const { response, payload } = await postLeetCodeGraphql(
    "samTrackLeetCodeSync",
    LEETCODE_SYNC_QUERY,
    {
      username
    }
  );

  if (response.status === 429) {
    return {
      ok: false,
      status: 429,
      error: "LeetCode is busy right now. Please try syncing again in a few minutes."
    };
  }

  if (response.ok && payload?.data?.matchedUser) {
    return {
      ok: true,
      matchedUser: payload.data.matchedUser,
      recentAcSubmissionList: payload.data.recentAcSubmissionList || []
    };
  }

  console.warn("[leetcode-sync] combined query failed, trying fallback", {
    username,
    status: response.status,
    graphqlErrors: payload?.errors?.length || 0
  });

  const [profileResult, recentResult] = await Promise.all([
    postLeetCodeGraphql("samTrackLeetCodeProfile", LEETCODE_PROFILE_QUERY, {
      username
    }),
    postLeetCodeGraphql("samTrackLeetCodeRecent", LEETCODE_RECENT_QUERY, {
      username
    })
  ]);

  if (profileResult.response.status === 429 || recentResult.response.status === 429) {
    return {
      ok: false,
      status: 429,
      error: "LeetCode is busy right now. Please try syncing again in a few minutes."
    };
  }

  const matchedUser = profileResult.payload?.data?.matchedUser;
  const recentAcSubmissionList =
    recentResult.payload?.data?.recentAcSubmissionList || [];

  if (matchedUser) {
    return {
      ok: true,
      matchedUser,
      recentAcSubmissionList
    };
  }

  const notFound =
    response.status === 404 ||
    profileResult.response.status === 404 ||
    !payload?.data?.matchedUser;

  if (notFound) {
    return {
      ok: false,
      status: 404,
      error: "We couldn't find that LeetCode username. Please check it and try again."
    };
  }

  return {
    ok: false,
    status: 502,
    error: "LeetCode data is unavailable right now. Please try again in a moment."
  };
}

function normalizeRecentSubmissions(submissions, difficultyMap, username, syncedAt) {
  return (submissions || [])
    .filter((submission) => submission?.titleSlug && submission?.timestamp)
    .sort((left, right) => Number(right.timestamp) - Number(left.timestamp))
    .slice(0, 20)
    .map((submission) => ({
      id: String(submission.id),
      problemId: String(submission.id),
      submissionId: String(submission.id),
      title: String(submission.title || "").trim(),
      titleSlug: submission.titleSlug,
      timestamp: submission.timestamp,
      solvedAt: new Date(Number(submission.timestamp) * 1000).toISOString(),
      difficulty: difficultyMap[submission.titleSlug] || "Unknown",
      language: submission.lang || null,
      runtime: submission.runtime || null,
      url: createLeetCodeLink(submission.titleSlug),
      username,
      source: "leetcode",
      syncedAt
    }));
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const requestedUsername = normalizeUsername(resolvedParams?.username);
  const body = await request.json().catch(() => ({}));
  const currentUsername = normalizeUsername(body?.currentUsername);
  const force = Boolean(body?.force);

  if (!requestedUsername) {
    return Response.json(
      { error: "LeetCode username is required." },
      { status: 400 }
    );
  }

  const cacheKey = requestedUsername.toLowerCase();
  const cachedPayload = !force ? getCachedValue(syncCache, cacheKey) : null;

  if (cachedPayload) {
    console.info("[leetcode-sync] cache hit", {
      username: requestedUsername,
      recentSubmissions: cachedPayload.recentSubmissions.length
    });
    return Response.json(cachedPayload);
  }

  console.info("[leetcode-sync] sync started", {
    username: requestedUsername,
    force
  });

  try {
    const result = await fetchRecentLeetCodeData(requestedUsername);

    if (!result.ok) {
      console.warn("[leetcode-sync] sync failed", {
        username: requestedUsername,
        status: result.status
      });
      return Response.json({ error: result.error }, { status: result.status });
    }

    const syncedAt = new Date().toISOString();
    const matchedUser = result.matchedUser;
    const breakdown = getBreakdown(matchedUser.submitStats?.acSubmissionNum);
    const difficultyMap = await fetchDifficultyMap(result.recentAcSubmissionList);
    const recentSubmissions = normalizeRecentSubmissions(
      result.recentAcSubmissionList,
      difficultyMap,
      matchedUser.username,
      syncedAt
    );
    const submissionCalendar = normalizeSubmissionCalendar(
      matchedUser.submissionCalendar
    );
    const nextLastUpdatedAt =
      currentUsername &&
      currentUsername.toLowerCase() === matchedUser.username.toLowerCase()
        ? body?.lastUpdatedAt || syncedAt
        : syncedAt;
    const responsePayload = {
      username: matchedUser.username,
      lastUpdatedAt: nextLastUpdatedAt,
      totalSolved: breakdown.totalSolved,
      breakdown: {
        easy: breakdown.easy,
        medium: breakdown.medium,
        hard: breakdown.hard
      },
      submissionCalendar,
      recentSubmissions,
      syncedAt
    };

    setCachedValue(syncCache, cacheKey, responsePayload, SYNC_CACHE_TTL_MS);

    console.info("[leetcode-sync] fetched submissions count", {
      username: matchedUser.username,
      recentAccepted: recentSubmissions.length
    });
    console.info("[leetcode-sync] sync completed", {
      username: matchedUser.username,
      totalSolved: breakdown.totalSolved,
      calendarDays: Object.keys(submissionCalendar).length
    });

    return Response.json(responsePayload);
  } catch (error) {
    console.error("[leetcode-sync] unexpected failure", {
      username: requestedUsername,
      message: error instanceof Error ? error.message : "unknown"
    });

    return Response.json(
      {
        error: "We couldn't update LeetCode right now. Please try again shortly."
      },
      { status: 500 }
    );
  }
}
