import * as React from "react";

import { cn } from "@/lib/utils";

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "destructive" }) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 text-sm",
        variant === "destructive"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "bg-card text-card-foreground",
        className,
      )}
      role="alert"
      {...props}
    />
  );
}

export { Alert };
