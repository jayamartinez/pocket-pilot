import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-6 lg:space-y-7">
      <div className="space-y-3 border-b border-border/80 pb-5">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-[360px]" />
        <Skeleton className="h-[360px]" />
      </div>

      <Skeleton className="h-[420px]" />
    </div>
  );
}
