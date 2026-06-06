import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "dashed" | "bordered";

const variantStyles: Record<CardVariant, string> = {
  default: "border border-black bg-white shadow-[4px_4px_0_#000]",
  dashed: "border border-dashed border-black bg-white shadow-[4px_4px_0_#000]",
  bordered: "border border-black/15 bg-white shadow-sm",
};

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
}: {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: "sm" | "md" | "lg";
}) {
  const paddingStyles = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-[16px]",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 border-b border-black/15 pb-4", className)}>
      {children}
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
