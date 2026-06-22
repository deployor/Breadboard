import type { ReactNode } from "react";
import { Surface } from "@/components/ui/card";

export function AccessCard({
  eyebrow,
  title,
  message,
  children,
}: {
  eyebrow: string;
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <main className="max-w-3xl">
      <Surface className="p-6">
        <p className="text-xs font-black tracking-[0.18em] text-[#BD0F32] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black text-black">{title}</h1>
        <p className="mt-2 text-sm font-semibold text-black/60">{message}</p>
        {children ? <div className="mt-5">{children}</div> : null}
      </Surface>
    </main>
  );
}
