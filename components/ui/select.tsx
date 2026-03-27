import * as React from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-xl border border-input bg-muted/70 px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
        className,
      )}
      {...props}
    />
  );
}
