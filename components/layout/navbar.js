"use client";

import { Bell, BellOff, LogOut, MoonStar, Save, SunMedium } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../ui/card";

export default function Navbar({
  section,
  saveState,
  theme,
  remindersEnabled,
  onThemeToggle,
  onReminderToggle,
  onSignOut
}) {
  const saveLabel =
    saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Autosave";

  return (
    <Card className="sticky top-6 z-20 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Productivity workspace
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white lg:text-4xl">
              {section.label}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {section.longDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 soft-divider"
          >
            <Save size={16} />
            {saveLabel}
          </motion.div>
          <button type="button" onClick={onThemeToggle} className="btn-secondary gap-2">
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button type="button" onClick={onReminderToggle} className="btn-secondary gap-2">
            {remindersEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {remindersEnabled ? "Alerts on" : "Alerts off"}
          </button>
          <button type="button" onClick={onSignOut} className="btn-secondary gap-2">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </Card>
  );
}
