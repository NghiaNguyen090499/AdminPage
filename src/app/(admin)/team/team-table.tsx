"use client";
/**
 * @nhom        : Admin / Team
 * @chucnang    : Bảng dữ liệu team members (client component) — có search/filter
 * @lienquan    : src/app/(admin)/team/page.tsx
 * @alias       : team-table
 */
import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TeamMember } from "@/types/database";

interface TeamTableProps {
  data: TeamMember[];
}

/** Tạo initials từ họ tên — "Nguyễn Văn An" → "NA" */
function getInitials(name: string): string {
  const p = name.trim().split(/\s+/);
  if (p.length === 1) return p[0][0]?.toUpperCase() ?? "?";
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

const avatarColors = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-red-400",
  "from-indigo-500 to-violet-400",
];

export function TeamTable({ data }: TeamTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // State cho search & filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  /** Dữ liệu đã lọc */
  const filtered = useMemo(() => {
    return data.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q) ||
        (m.email?.toLowerCase().includes(q) ?? false);

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "published" && m.isPublished) ||
        (filterStatus === "draft" && !m.isPublished);

      return matchSearch && matchStatus;
    });
  }, [data, search, filterStatus]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { deleteTeamAction } = await import("@/lib/actions/team");
      const result = await deleteTeamAction(id);
      if (result.success) {
        startTransition(() => router.refresh());
      } else {
        alert(result.error || result.message);
      }
    } catch {
      alert("Lỗi khi xóa");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const countSocials = (links: TeamMember["socialLinks"]) => {
    if (!links) return 0;
    return Object.values(links).filter(Boolean).length;
  };

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Chưa có thành viên</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">Thêm thành viên đầu tiên vào đội ngũ</p>
        <Link href="/team/new" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-sm font-medium">
          Thêm thành viên
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Search & Filter bar */}
      <div className="px-6 py-4 border-b border-[var(--border)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm thành viên..."
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm px-3 outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Hiển thị</option>
            <option value="draft">Ẩn</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">{filtered.length}</span>
            {filtered.length !== data.length ? ` / ${data.length}` : ""} thành viên
          </p>
          {(search || filterStatus !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilterStatus("all"); }}
              className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Bảng */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Không tìm thấy thành viên phù hợp</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["#", "Thành viên", "Chức vụ", "Email", "Liên kết", "Trạng thái", ""].map((h, i) => (
                  <th key={i} className={`text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider px-6 py-3 ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((m, idx) => (
                <tr key={m.id} className="group transition-colors hover:bg-[var(--muted)]/30">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--muted)] text-xs font-medium">{m.sortOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-xs font-bold">{getInitials(m.fullName)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{m.fullName}</p>
                        {m.bio && <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1 max-w-[250px]">{m.bio}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground)]">{m.position}</td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{m.email || "—"}</td>
                  <td className="px-6 py-4">
                    {countSocials(m.socialLinks) > 0 ? (
                      <span className="text-xs text-[var(--muted-foreground)]">{countSocials(m.socialLinks)} liên kết</span>
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]/50">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={m.isPublished ? "success" : "warning"}>{m.isPublished ? "Hiển thị" : "Ẩn"}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/team/${m.id}/edit`}>
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Button>
                      </Link>
                      {confirmId === m.id ? (
                        <div className="flex items-center gap-1">
                          <Button variant="destructive" size="xs" className="cursor-pointer" onClick={() => handleDelete(m.id)} disabled={deletingId === m.id || isPending}>
                            {deletingId === m.id ? "..." : "Xóa"}
                          </Button>
                          <Button variant="ghost" size="xs" className="cursor-pointer" onClick={() => setConfirmId(null)}>Hủy</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400" onClick={() => setConfirmId(m.id)}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
