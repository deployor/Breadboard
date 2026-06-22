import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  elevated?: boolean;
};

export function Card({
  children,
  className,
  elevated = true,
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[18px] border border-black bg-white",
        elevated && "shadow-[4px_4px_0_#000]",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}

export function CardSection({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function Surface({
  children,
  className,
  elevated = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-black bg-white p-6",
        elevated && "shadow-[4px_4px_0_#000]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProseCard({ children }: { children: ReactNode }) {
  return (
    <Surface className="prose prose-neutral max-w-none bg-[#f4f4f4] p-8 prose-a:text-[#bc0f32] prose-img:border-[1.1px] prose-img:border-black prose-img:bg-white prose-img:shadow-[3px_3px_0_#000]">
      {children}
    </Surface>
  );
}
