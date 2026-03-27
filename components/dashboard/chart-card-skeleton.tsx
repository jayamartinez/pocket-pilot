import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartCardSkeleton({
  chartHeightClassName,
}: {
  chartHeightClassName: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full max-w-72" />
      </CardHeader>
      <CardContent>
        <Skeleton className={chartHeightClassName} />
      </CardContent>
    </Card>
  );
}
