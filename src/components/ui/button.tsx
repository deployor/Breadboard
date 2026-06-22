import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonTone = "primary" | "ink" | "paper" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-black font-black no-underline transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-[5px] focus-visible:ring-[#bd0f3273] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45";

const toneClass: Record<ButtonTone, string> = {
  primary:
    "bg-[#BD0F32] text-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5 hover:bg-black active:translate-y-0",
  ink: "bg-black text-white shadow-[3px_3px_0_#BD0F32] hover:-translate-y-0.5 hover:bg-[#BD0F32] active:translate-y-0",
  paper:
    "bg-white text-black shadow-[2px_2px_0_#000] hover:-translate-y-0.5 hover:bg-black hover:text-white active:translate-y-0",
  danger:
    "bg-white text-[#BD0F32] shadow-[2px_2px_0_#000] hover:-translate-y-0.5 hover:bg-[#BD0F32] hover:text-white active:translate-y-0",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3 text-sm",
};

export function buttonClass({
  tone = "paper",
  size = "md",
  className,
}: {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(baseButtonClass, toneClass[tone], sizeClass[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({
  tone = "paper",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ tone, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
