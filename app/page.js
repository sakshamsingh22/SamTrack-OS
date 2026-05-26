"use client";

import { useEffect, useRef, useState } from "react";
import AuthScreen from "../components/auth-screen";
import DashboardSkeleton from "../components/layout/dashboard-skeleton";
import SamTrackApp from "../components/sam-track-app";
import {
  AUTH_STORAGE_KEY,
  THEME_STORAGE_KEY,
  USERS_STORAGE_KEY,
  createInitialData,
  getDataStorageKey,
  hashValue,
  normalizeData
} from "../lib/sam-track";

function readStoredValue(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const initializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }

    const storedSession = readStoredValue(AUTH_STORAGE_KEY, null);
    const users = readStoredValue(USERS_STORAGE_KEY, {});

    if (storedSession?.email && users?.[storedSession.email]) {
      const user = users[storedSession.email];
      const storedData = readStoredValue(getDataStorageKey(user.email), null);
      setSession({ email: user.email });
      setData(
        storedData
          ? normalizeData(storedData, user)
          : createInitialData({
              name: user.name,
              email: user.email,
              focusArea: user.focusArea
            })
      );
    }

    const hydrationTimer = window.setTimeout(() => setHydrating(false), 420);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [mounted, theme]);

  useEffect(() => {
    if (!mounted || !session?.email || !data) {
      return;
    }

    if (initializedRef.current) {
      setSaveState("saving");
    }

    window.localStorage.setItem(
      getDataStorageKey(session.email),
      JSON.stringify(data)
    );

    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    const savedTimer = window.setTimeout(() => setSaveState("saved"), 140);
    const resetTimer = window.setTimeout(() => setSaveState("idle"), 1600);

    return () => {
      window.clearTimeout(savedTimer);
      window.clearTimeout(resetTimer);
    };
  }, [data, mounted, session]);

  async function handleSignup(formData) {
    setBusy(true);
    setError("");

    try {
      const email = formData.email.trim().toLowerCase();
      const users = readStoredValue(USERS_STORAGE_KEY, {});

      if (users[email]) {
        throw new Error("An account with this email already exists.");
      }

      const passwordHash = await hashValue(formData.password);
      const user = {
        name: formData.name.trim(),
        email,
        focusArea: formData.focusArea.trim(),
        passwordHash,
        createdAt: new Date().toISOString()
      };

      window.localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify({
          ...users,
          [email]: user
        })
      );
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          email
        })
      );

      const initialData = createInitialData(user);
      window.localStorage.setItem(getDataStorageKey(email), JSON.stringify(initialData));
      setSession({ email });
      setData(initialData);
      initializedRef.current = false;
    } catch (signupError) {
      setError(signupError.message || "Unable to create the account.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(formData) {
    setBusy(true);
    setError("");

    try {
      const email = formData.email.trim().toLowerCase();
      const users = readStoredValue(USERS_STORAGE_KEY, {});
      const user = users[email];

      if (!user) {
        throw new Error("No local account was found for this email.");
      }

      const passwordHash = await hashValue(formData.password);

      if (user.passwordHash !== passwordHash) {
        throw new Error("Incorrect password.");
      }

      const storedData = readStoredValue(getDataStorageKey(email), null);
      const normalized = storedData
        ? normalizeData(storedData, user)
        : createInitialData(user);

      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          email
        })
      );
      setSession({ email });
      setData(normalized);
      initializedRef.current = false;
    } catch (loginError) {
      setError(loginError.message || "Unable to log in.");
    } finally {
      setBusy(false);
    }
  }

  function handleSignOut() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
    setData(null);
    setError("");
    setSaveState("idle");
    initializedRef.current = false;
  }

  if (!mounted || hydrating) {
    return <DashboardSkeleton />;
  }

  if (!session || !data) {
    return (
      <AuthScreen
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onLogin={handleLogin}
        onSignup={handleSignup}
        busy={busy}
        error={error}
      />
    );
  }

  return (
    <SamTrackApp
      data={data}
      saveState={saveState}
      theme={theme}
      onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      onDataChange={setData}
      onSignOut={handleSignOut}
    />
  );
}
