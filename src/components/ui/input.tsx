/**
 * @nhom        : UI
 * @chucnang    : Input component — ô nhập liệu cơ bản
 * @lienquan    : src/components/ui/label.tsx
 * @alias       : input, text-field
 */
import { cn } from "@/lib/utils";

/** Props cho Input — kế thừa từ HTML input */
function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-input/30 px-3 py-2 text-sm",
        "text-foreground placeholder:text-muted-foreground",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
