import { cn } from "@/lib/utils";

interface ProgressProps {
  className?: string;
  indicatorClassName?: string;
  value: number;
}

export function Progress({
  className,
  indicatorClassName,
  value,
}: ProgressProps) {
  return (
    <div className={cn("h-2.5 overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-[width]",
          indicatorClassName,
        )}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
