"use client";

import { cn } from "@/lib/utils";

export function TableWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto my-6 -mx-4 sm:mx-0 rounded-lg border border-border">
      <table className={cn("w-full min-w-[400px] text-sm", className)}>
        {children}
      </table>
    </div>
  );
}
