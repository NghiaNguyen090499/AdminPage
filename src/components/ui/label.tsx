/**
 * @nhom        : UI
 * @chucnang    : Label component — nhãn cho form fields
 * @lienquan    : src/components/ui/input.tsx
 * @alias       : label, form-label
 */
import { cn } from "@/lib/utils";

/** Props cho Label — kế thừa từ HTML label */
function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none",
        "text-foreground select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
