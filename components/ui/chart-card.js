import Card, { CardHeader } from "./card";

export default function ChartCard({
  eyebrow,
  title,
  description,
  action,
  children,
  className = ""
}) {
  return (
    <Card className={`relative isolate min-w-0 overflow-hidden space-y-5 ${className}`}>
      <CardHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
      />
      <div className="min-w-0">{children}</div>
    </Card>
  );
}
