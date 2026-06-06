import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { pageGridClass } from "./styles";

export function DocsFrame({
  children,
  sidebar = true,
}: {
  children: ReactNode;
  sidebar?: boolean;
}) {
  return (
    <div className={`${pageGridClass} min-h-screen`}>
      <Header isSticky />
      {sidebar ? <Sidebar /> : null}
      <main
        className={`min-h-screen px-6 pt-24 pb-16 md:pt-28 md:pr-8 md:pb-16 ${sidebar ? "md:pl-[272px]" : "md:px-8"}`}
      >
        {children}
      </main>
      <Footer />
    </div>
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
