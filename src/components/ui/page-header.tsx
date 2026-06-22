import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 rounded-[20px] border border-black bg-white p-5 shadow-[5px_5px_0_#000] md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#BD0F32]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-4xl font-black leading-none text-black md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm font-bold leading-relaxed text-black/55">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function PageHero({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <PageHeader title={title} description={undefined}>
        {children}
      </PageHeader>
    </div>
  );
}
