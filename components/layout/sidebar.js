"use client";

import { motion } from "framer-motion";
import Card from "../ui/card";

export default function Sidebar({
  sections,
  activeSection,
  onSectionChange,
  profile
}) {
  return (
    <>
      <Card className="sticky top-6 hidden h-[calc(100vh-48px)] min-h-[720px] w-[248px] flex-col justify-between p-5 xl:flex">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 text-xl font-bold text-white shadow-lg shadow-sky-500/20">
                S
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                  Sam Track
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Student OS
                </div>
              </div>
            </div>
            <div className="rounded-2xl border px-4 py-4 soft-divider">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Workspace
              </div>
              <div className="mt-2 font-medium text-slate-950 dark:text-white">
                {profile.name}
              </div>
              <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {profile.focusArea}
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSectionChange(section.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg shadow-sky-500/20"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/70 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <div>
                    <div>{section.label}</div>
                    <div
                      className={`text-xs ${
                        active ? "text-white/75" : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {section.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-2xl border bg-slate-50/70 px-4 py-4 dark:bg-slate-950/45 soft-divider">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Design direction
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Minimal navigation, one focused workspace, and a quieter insights rail.
          </p>
        </div>
      </Card>

      <div className="xl:hidden">
        <Card className="p-3">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 text-base font-bold text-white">
              S
            </div>
            <div>
              <div className="font-semibold text-slate-950 dark:text-white">Sam Track</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {profile.name}
              </div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSectionChange(section.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-teal-500 to-sky-600 text-white"
                      : "bg-slate-100/75 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300"
                  }`}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
