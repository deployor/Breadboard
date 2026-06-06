import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-xl bg-[#BD0F32] px-4 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5 hover:bg-black disabled:opacity-50",
  secondary:
    "rounded-xl bg-black px-4 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#BD0F32] hover:-translate-y-0.5 hover:bg-[#BD0F32] disabled:opacity-50",
  outline:
    "rounded-xl border border-black bg-white px-4 py-2.5 text-sm font-black text-black shadow-[3px_3px_0_#000] hover:-translate-y-0.5 hover:bg-black hover:text-white disabled:opacity-50",
  ghost:
    "rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-60",
  danger:
    "rounded-xl border border-red-700 bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:opacity-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-black transition-all disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
