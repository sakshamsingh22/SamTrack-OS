import Card from "./card";

export default function StatBox({
  icon: Icon,
  label,
  value,
  meta,
  tone = "teal"
}) {
  const toneClass = {
    teal: "from-teal-500/18 to-sky-500/12 text-teal-700 dark:text-teal-300",
    green: "from-emerald-500/18 to-lime-400/12 text-emerald-700 dark:text-emerald-300",
    yellow: "from-amber-400/24 to-yellow-300/12 text-amber-700 dark:text-amber-300",
    red: "from-rose-400/18 to-red-400/12 text-rose-700 dark:text-rose-300"
  };

  return (
    <Card className="h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{meta}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClass[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
