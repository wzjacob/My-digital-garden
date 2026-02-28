import { cn } from "@/lib/utils";

const CALLOUT_STYLES = {
  note: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  tip: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
  info: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
};

const CALLOUT_TITLES = {
  note: "备注",
  warning: "注意",
  tip: "提示",
  info: "信息",
};

type CalloutType = keyof typeof CALLOUT_STYLES;

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ type = "note", title, children, className, ...props }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-4 rounded-lg border-l-4 p-4",
        CALLOUT_STYLES[type],
        className
      )}
      {...props}
    >
      <p className="font-semibold text-sm mb-2">
        {title ?? CALLOUT_TITLES[type]}
      </p>
      <div className="text-sm [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
