import type { ReactNode } from "react";
import { Callout } from "./Callout";
import { TableWrapper } from "./TableWrapper";

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
    ...overrides,
  };
}
