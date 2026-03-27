import * as React from "react";

import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b [&_tr]:border-border/70", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0 [&_tr]:border-b [&_tr]:border-border/55",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("transition-colors hover:bg-muted/55", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-9 px-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}
