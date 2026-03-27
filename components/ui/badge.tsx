import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary/14 text-primary",
        secondary: "bg-muted text-foreground/80",
        success: "bg-success/14 text-success",
        warning: "bg-amber-400/12 text-amber-500 dark:text-amber-300",
        danger: "bg-danger/14 text-danger",
        outline: "border border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, variant, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
