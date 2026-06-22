import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function inputClass(className?: string) {
  return cn(
    "rounded-[10px] border border-black bg-[#f4f4f4] px-3 py-2.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-[#BD0F32]/20",
    className,
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return <input ref={ref} className={inputClass(className)} {...props} />;
});
Input.displayName = "Input";

export function Label({
  children,
  className,
  htmlFor,
}: {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-xs font-black uppercase tracking-[0.14em] text-black/45",
        className,
      )}
    >
      {children}
    </label>
  );
}
