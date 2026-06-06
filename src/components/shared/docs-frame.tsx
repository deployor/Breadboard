import type { ReactNode } from "react";

export function PageHero({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 rounded-[12px] border-[1.1px] border-black bg-[#f4f4f4] p-8 shadow-[4px_4px_0_#000]">
      <h1 className="text-4xl font-bold text-black md:text-5xl">{title}</h1>
      {children}
    </div>
  );
}

export function ProseCard({ children }: { children: ReactNode }) {
  return (
    <div className="prose prose-neutral max-w-none rounded-[12px] border-[1.1px] border-black bg-[#f4f4f4] p-8 shadow-[4px_4px_0_#000] prose-img:border-[1.1px] prose-img:border-black prose-img:bg-white prose-img:shadow-[3px_3px_0_#000] prose-a:text-[#bc0f32]">
      {children}
    </div>
  );
}
