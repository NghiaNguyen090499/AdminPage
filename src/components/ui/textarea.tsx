/**
 * @nhom        : UI
 * @chucnang    : Textarea component — ô nhập nội dung nhiều dòng
 * @lienquan    : src/components/ui/input.tsx
 * @alias       : textarea, text-area
 */
import { cn } from "@/lib/utils";

/** Props cho Textarea — kế thừa từ HTML textarea */
function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-border bg-input/30 px-3 py-2 text-sm",
        "text-foreground placeholder:text-muted-foreground",
        "transition-all duration-200 resize-y",
        "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
