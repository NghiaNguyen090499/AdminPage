"use client";
/**
 * @nhom        : UI Components
 * @chucnang    : Component upload ảnh — drag & drop, preview, upload lên Supabase Storage
 * @input       : value (string), onChange (callback), folder (string)
 * @output      : URL ảnh đã upload hoặc nhập tay
 * @lienquan    : src/lib/actions/upload.ts
 * @alias       : image-upload, file-uploader
 */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  /** URL ảnh hiện tại */
  value: string;
  /** Callback khi URL thay đổi */
  onChange: (url: string) => void;
  /** Thư mục lưu trên Storage (team, services, products, company) */
  folder: string;
  /** Label hiển thị */
  label?: string;
  /** Mô tả bổ sung */
  description?: string;
  /** Chiều cao vùng preview (px) */
  previewHeight?: number;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Hình ảnh",
  description,
  previewHeight = 200,
}: ImageUploadProps) {
  // Trạng thái upload
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  // Chế độ: "upload" hoặc "url"
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Xử lý upload file
   * @input  : file (File) — file ảnh cần upload
   */
  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        // Import động để tránh bundling không cần thiết
        const { uploadFileAction } = await import("@/lib/actions/upload");

        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", folder);

        const result = await uploadFileAction(formData);

        if (result.success && result.url) {
          onChange(result.url);
        } else {
          setError(result.error || "Upload thất bại");
        }
      } catch {
        setError("Đã xảy ra lỗi khi upload");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  /** Khi chọn file từ input */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  /** Xử lý drag & drop */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      } else {
        setError("Chỉ chấp nhận file ảnh");
      }
    },
    [handleUpload]
  );

  /** Xóa ảnh hiện tại */
  const handleRemove = async () => {
    if (value && value.includes("supabase.co")) {
      // Nếu là ảnh Supabase → xóa trên storage
      try {
        const { deleteFileAction } = await import("@/lib/actions/upload");
        await deleteFileAction(value);
      } catch {
        // Bỏ qua lỗi xóa — vẫn clear URL
      }
    }
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Label + Toggle mode */}
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1 rounded-lg border border-[var(--border)] p-0.5">
          <button
            type="button"
            className={`px-2 py-0.5 text-xs rounded-md transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setMode("upload")}
          >
            Upload
          </button>
          <button
            type="button"
            className={`px-2 py-0.5 text-xs rounded-md transition-all cursor-pointer ${
              mode === "url"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setMode("url")}
          >
            URL
          </button>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="p-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Mode: Upload file */}
      {mode === "upload" && !value && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed 
            transition-all duration-200 cursor-pointer
            ${
              dragOver
                ? "border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.01]"
                : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--accent)]/30"
            }
            ${uploading ? "opacity-60 pointer-events-none" : ""}
          `}
          style={{ minHeight: `${previewHeight}px` }}
        >
          {uploading ? (
            <>
              {/* Spinner khi đang upload */}
              <svg
                className="animate-spin h-8 w-8 text-[var(--primary)]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm text-[var(--muted-foreground)]">
                Đang upload...
              </p>
            </>
          ) : (
            <>
              {/* Icon upload */}
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Kéo thả ảnh vào đây
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  hoặc click để chọn file • JPG, PNG, WebP, GIF • Tối đa 5MB
                </p>
              </div>
            </>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Mode: URL thủ công */}
      {mode === "url" && !value && (
        <Input
          placeholder="https://example.com/image.jpg"
          onBlur={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              if (input.value) onChange(input.value);
            }
          }}
        />
      )}

      {/* Preview ảnh đã chọn */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-[var(--border)]">
          <img
            src={value}
            alt="Preview"
            className="w-full object-cover"
            style={{ maxHeight: `${previewHeight}px` }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%231a1a2e' width='200' height='200'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14'%3EẢnh lỗi%3C/text%3E%3C/svg%3E";
            }}
          />
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                setMode("upload");
                handleRemove();
              }}
            >
              Đổi ảnh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              onClick={handleRemove}
            >
              Xóa
            </Button>
          </div>
          {/* URL hiện tại */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[10px] text-white/60 truncate">{value}</p>
          </div>
        </div>
      )}

      {/* Mô tả bổ sung */}
      {description && (
        <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
      )}
    </div>
  );
}
