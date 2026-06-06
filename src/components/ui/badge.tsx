import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const variants = {
    default: "bg-zinc-100 text-zinc-600",
    success: "border-green-800 bg-green-50 text-green-800",
    warning: "border-yellow-800 bg-yellow-50 text-yellow-900",
    danger: "border-red-700 bg-red-50 text-red-700",
    info: "border-blue-800 bg-blue-50 text-blue-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-black uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
