import type { ReactNode } from "react";
import { PageHero, ProseCard } from "./docs-frame";

export function DocsFrame({
  children,
}: {
  children: ReactNode;
  sidebar?: boolean;
}) {
  return <div className="space-y-6">{children}</div>;
}

export { PageHero, ProseCard };
