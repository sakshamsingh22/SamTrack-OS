"use client";

import { motion } from "framer-motion";

export default function GridCell({
  disabled,
  status,
  weekIndex,
  onClick
}) {
  const stateClass =
    status === "done"
      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
      : status === "missed"
        ? "border-rose-300 bg-rose-500/10 text-rose-600 dark:border-rose-500/40 dark:text-rose-300"
        : `week-band-${weekIndex} text-slate-400 dark:text-slate-500`;

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.05, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-bold transition ${
        disabled
          ? "cursor-not-allowed border-transparent bg-slate-100/70 text-slate-300 dark:bg-slate-900/60 dark:text-slate-700"
          : stateClass
      }`}
    >
      {status === "done" ? "✔" : status === "missed" ? "✕" : ""}
    </motion.button>
  );
}
