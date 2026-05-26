"use client";

import { useState } from "react";
import { LockKeyhole, MoonStar, Sparkles, SunMedium } from "lucide-react";

const FEATURE_ITEMS = [
  "Monthly habit grid with week blocks",
  "DSA streaks, goals, and analytics",
  "Pomodoro focus timer and exports"
];

export default function AuthScreen({
  theme,
  onToggleTheme,
  onLogin,
  onSignup,
  busy,
  error
}) {
  const [mode, setMode] = useState("signup");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    focusArea: "Coding interviews and strong study consistency"
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  function handleSignupSubmit(event) {
    event.preventDefault();
    onSignup(signupForm);
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    onLogin(loginForm);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl justify-end pb-6">
        <button
          type="button"
          onClick={onToggleTheme}
          className="btn-secondary gap-2"
        >
          {theme === "dark" ? <SunMedium size={17} /> : <MoonStar size={17} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-emerald-400/20 via-sky-400/20 to-amber-300/20" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                <Sparkles size={14} />
                Local-first tracker
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-emerald-500 to-teal-700 text-3xl font-black text-white shadow-lg shadow-emerald-500/20">
                    S
                  </div>
                  <div>
                    <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                      Sam Track
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-300">
                      Track. Improve. Dominate.
                    </p>
                  </div>
                </div>
                <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  A focused dashboard for students balancing coding prep, DSA
                  practice, revision, and everyday discipline.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {FEATURE_ITEMS.map((item) => (
                <div key={item} className="panel-muted animate-fadeUp">
                  <div className="eyebrow mb-3">Built in</div>
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="panel-muted flex items-start gap-3">
              <div className="mt-1 rounded-2xl bg-sky-500/10 p-2 text-sky-700 dark:text-sky-300">
                <LockKeyhole size={18} />
              </div>
              <div>
                <p className="font-semibold">Local account mode</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Login and signup are stored in this browser so you can use the
                  app immediately without a backend.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="mb-6 flex rounded-2xl border border-slate-200/70 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-900/70">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Log in
            </button>
          </div>

          {mode === "signup" ? (
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold">Name</label>
                <input
                  className="field"
                  placeholder="Sam Singh"
                  value={signupForm.name}
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Email</label>
                <input
                  className="field"
                  type="email"
                  placeholder="sam@example.com"
                  value={signupForm.email}
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Password</label>
                <input
                  className="field"
                  type="password"
                  placeholder="Create a local password"
                  value={signupForm.password}
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Focus area
                </label>
                <input
                  className="field"
                  placeholder="Coding interviews, DSA, revision..."
                  value={signupForm.focusArea}
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      focusArea: event.target.value
                    }))
                  }
                />
              </div>
              {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              ) : null}
              <button type="submit" className="btn-primary w-full" disabled={busy}>
                {busy ? "Creating account..." : "Create Sam Track account"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold">Email</label>
                <input
                  className="field"
                  type="email"
                  placeholder="sam@example.com"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Password</label>
                <input
                  className="field"
                  type="password"
                  placeholder="Enter your local password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  required
                />
              </div>
              {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              ) : null}
              <button type="submit" className="btn-primary w-full" disabled={busy}>
                {busy ? "Logging in..." : "Open dashboard"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
