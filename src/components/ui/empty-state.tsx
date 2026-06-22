import type { ReactNode } from "react";
import { Card, CardSection } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed bg-[#f4f4f4]">
      <CardSection className="p-8">
        <p className="text-2xl font-black text-black">{title}</p>
        <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-black/55">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardSection>
    </Card>
  );
}
