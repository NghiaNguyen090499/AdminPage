"use client";
/**
 * @nhom        : Components / UI
 * @chucnang    : Rich text editor dùng TipTap — WYSIWYG cho các trường nội dung dài
 * @input       : value (string) — nội dung HTML hiện tại
 *              : onChange (fn) — callback khi nội dung thay đổi
 * @output      : Editor WYSIWYG với toolbar định dạng
 * @lienquan    : @tiptap/react, @tiptap/starter-kit
 * @alias       : rich-text-editor, tiptap-editor, wysiwyg
 */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  /** Nội dung HTML hiện tại */
  value: string;
  /** Callback khi nội dung thay đổi — trả về chuỗi HTML */
  onChange: (html: string) => void;
  /** Label hiển thị phía trên editor */
  label?: string;
  /** Placeholder khi editor rỗng */
  placeholder?: string;
  /** Chiều cao tối thiểu (px) — mặc định 200 */
  minHeight?: number;
}

/** Danh sách nút toolbar */
const TOOLBAR_GROUPS = [
  {
    label: "Heading",
    items: [
      { key: "h1", icon: "H1", title: "Heading 1" },
      { key: "h2", icon: "H2", title: "Heading 2" },
      { key: "h3", icon: "H3", title: "Heading 3" },
    ],
  },
  {
    label: "Format",
    items: [
      { key: "bold", icon: "B", title: "In đậm (Ctrl+B)" },
      { key: "italic", icon: "I", title: "In nghiêng (Ctrl+I)" },
      { key: "strike", icon: "S", title: "Gạch ngang" },
      { key: "code", icon: "<>", title: "Code inline" },
    ],
  },
  {
    label: "List",
    items: [
      { key: "bulletList", icon: "•", title: "Danh sách gạch đầu dòng" },
      { key: "orderedList", icon: "1.", title: "Danh sách đánh số" },
    ],
  },
  {
    label: "Block",
    items: [
      { key: "blockquote", icon: "❝", title: "Trích dẫn" },
      { key: "codeBlock", icon: "{}", title: "Code block" },
      { key: "horizontalRule", icon: "—", title: "Đường kẻ ngang" },
    ],
  },
];

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Nhập nội dung...",
  minHeight = 200,
}: RichTextEditorProps) {
  /** Khởi tạo TipTap editor */
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  /** Xử lý click nút toolbar */
  const handleAction = (key: string) => {
    const chain = editor.chain().focus();
    switch (key) {
      case "h1":
        chain.toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        chain.toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        chain.toggleHeading({ level: 3 }).run();
        break;
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "strike":
        chain.toggleStrike().run();
        break;
      case "code":
        chain.toggleCode().run();
        break;
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
      case "blockquote":
        chain.toggleBlockquote().run();
        break;
      case "codeBlock":
        chain.toggleCodeBlock().run();
        break;
      case "horizontalRule":
        chain.setHorizontalRule().run();
        break;
    }
  };

  /** Kiểm tra nút đang active */
  const isActive = (key: string): boolean => {
    switch (key) {
      case "h1":
        return editor.isActive("heading", { level: 1 });
      case "h2":
        return editor.isActive("heading", { level: 2 });
      case "h3":
        return editor.isActive("heading", { level: 3 });
      case "bold":
        return editor.isActive("bold");
      case "italic":
        return editor.isActive("italic");
      case "strike":
        return editor.isActive("strike");
      case "code":
        return editor.isActive("code");
      case "bulletList":
        return editor.isActive("bulletList");
      case "orderedList":
        return editor.isActive("orderedList");
      case "blockquote":
        return editor.isActive("blockquote");
      case "codeBlock":
        return editor.isActive("codeBlock");
      default:
        return false;
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Editor container — bo tròn, viền, nền card */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[var(--ring)]">
        {/* Toolbar — thanh công cụ định dạng */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--muted)]/30">
          {TOOLBAR_GROUPS.map((group, gi) => (
            <div key={gi} className="flex items-center">
              {gi > 0 && (
                <div className="w-px h-5 bg-[var(--border)] mx-1.5" />
              )}
              {group.items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  title={item.title}
                  onClick={() => handleAction(item.key)}
                  className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-md text-xs font-semibold
                    transition-all cursor-pointer select-none
                    ${
                      isActive(item.key)
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    }
                  `}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          ))}

          {/* Nút undo/redo bên phải */}
          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              title="Hoàn tác (Ctrl+Z)"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↶
            </button>
            <button
              type="button"
              title="Làm lại (Ctrl+Y)"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↷
            </button>
          </div>
        </div>

        {/* Vùng soạn thảo — prose styling */}
        <div
          className="px-4 py-3"
          style={{ minHeight: `${minHeight}px` }}
        >
          <EditorContent
            editor={editor}
            className="
              [&_.tiptap]:outline-none
              [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mb-3 [&_.tiptap_h1]:mt-4
              [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:mt-3
              [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-medium [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:mt-3
              [&_.tiptap_p]:mb-2 [&_.tiptap_p]:leading-relaxed
              [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ul]:mb-2
              [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_ol]:mb-2
              [&_.tiptap_li]:mb-1
              [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-[var(--primary)]/40 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-[var(--muted-foreground)] [&_.tiptap_blockquote]:mb-2
              [&_.tiptap_pre]:bg-[var(--muted)] [&_.tiptap_pre]:rounded-lg [&_.tiptap_pre]:p-3 [&_.tiptap_pre]:mb-2 [&_.tiptap_pre]:font-mono [&_.tiptap_pre]:text-sm
              [&_.tiptap_code]:bg-[var(--muted)] [&_.tiptap_code]:rounded [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-sm [&_.tiptap_code]:text-[var(--primary)]
              [&_.tiptap_hr]:border-[var(--border)] [&_.tiptap_hr]:my-4
              [&_.tiptap_strong]:font-bold
              [&_.tiptap_em]:italic
              [&_.tiptap_s]:line-through
              [&_.tiptap_.is-editor-empty:first-child::before]:text-[var(--muted-foreground)] [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none
            "
          />
        </div>
      </div>

      {/* Hint — phím tắt */}
      <p className="text-xs text-[var(--muted-foreground)]">
        Phím tắt: <kbd className="px-1 py-0.5 rounded bg-[var(--muted)] text-[10px] font-mono">Ctrl+B</kbd> đậm
        {" · "}
        <kbd className="px-1 py-0.5 rounded bg-[var(--muted)] text-[10px] font-mono">Ctrl+I</kbd> nghiêng
        {" · "}
        <kbd className="px-1 py-0.5 rounded bg-[var(--muted)] text-[10px] font-mono">Ctrl+Z</kbd> hoàn tác
      </p>
    </div>
  );
}
