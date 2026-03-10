import type { ReactNode } from "react";
import { Callout } from "./Callout";
import { TableWrapper } from "./TableWrapper";

const proseMedia =
  "max-w-full h-auto rounded-lg shadow-md my-4 overflow-hidden";

export function getMDXComponents(
  overrides: Record<string, React.ComponentType<{ children?: ReactNode }>> = {}
): Record<string, React.ComponentType<{ children?: ReactNode }>> {
  return {
    blockquote: ({ children, ...props }: { children?: ReactNode }) => (
      <Callout type="note" {...props}>
        {children}
      </Callout>
    ),
    table: ({ children, ...props }: { children?: ReactNode }) => (
      <TableWrapper>
        <table {...props}>{children}</table>
      </TableWrapper>
    ),
    img: ({ src, alt, ...props }: React.ComponentProps<"img">) => (
      <img
        src={src}
        alt={alt ?? ""}
        className={proseMedia}
        loading="lazy"
        decoding="async"
        {...props}
      />
    ),
    video: ({ src, ...props }: React.ComponentProps<"video">) => (
      <video
        src={src}
        controls
        className={proseMedia}
        playsInline
        preload="metadata"
        {...props}
      />
    ),
    pre: ({ children, ...props }: { children?: ReactNode }) => (
      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 my-4 text-sm" {...props}>
        {children}
      </pre>
    ),
    ...overrides,
  };
}
