export default function Card({ children, className = "", tone = "default" }) {
  const toneClass =
    tone === "glass"
      ? "bg-white/70 dark:bg-slate-950/45"
      : "bg-transparent";

  return <div className={`panel ${toneClass} ${className}`}>{children}</div>;
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
  className = ""
}) {
  return (
    <div
      className={`flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between soft-divider ${className}`}
    >
      <div className="space-y-2">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        {title ? (
          <h2 className="text-[28px] font-semibold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
