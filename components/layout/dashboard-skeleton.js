import Card from "../ui/card";

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-6 xl:grid-cols-[248px_minmax(0,1fr)_320px]">
        <Card className="hidden h-[calc(100vh-48px)] xl:block">
          <div className="space-y-4">
            <SkeletonBlock className="h-12 w-36" />
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-14 w-full" />
            <SkeletonBlock className="h-14 w-full" />
            <SkeletonBlock className="h-14 w-full" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-12 w-64" />
              <SkeletonBlock className="h-4 w-full max-w-2xl" />
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <div className="space-y-4">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-8 w-24" />
                  <SkeletonBlock className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
          <Card className="space-y-6">
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-80 w-full" />
          </Card>
        </div>

        <div className="hidden space-y-6 xl:block">
          <Card>
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="mt-6 h-28 w-full" />
          </Card>
          <Card>
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="mt-6 h-40 w-full" />
          </Card>
          <Card>
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="mt-6 h-24 w-full" />
          </Card>
        </div>
      </div>
    </main>
  );
}
