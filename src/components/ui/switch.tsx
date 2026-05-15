/**
 * @nhom        : UI
 * @chucnang    : Switch component — nút bật/tắt (toggle)
 * @lienquan    : src/components/ui/label.tsx
 * @alias       : switch, toggle
 */
"use client";

import { cn } from "@/lib/utils";

/** Props cho Switch */
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

/**
 * Switch component — nút gạt bật/tắt
 * Dùng cho các trường boolean (isPublished, isFeatured, ...)
 */
function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  id,
  name,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent shadow-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
    >
      {/* Hidden input cho form submission */}
      {name && (
        <input type="hidden" name={name} value={checked ? "true" : "false"} />
      )}
      {/* Nút tròn trượt */}
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

export { Switch };
export type { SwitchProps };
