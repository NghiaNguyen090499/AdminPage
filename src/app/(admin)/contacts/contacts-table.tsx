"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ContactSubmission } from "@/types/database";

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ContactsTable({ data }: { data: ContactSubmission[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((item) => {
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.phone?.toLowerCase().includes(q) ?? false) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <h3 className="mb-1 text-lg font-semibold text-[var(--foreground)]">
          Chưa có liên hệ nào
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Khi khách gửi form từ website, dữ liệu sẽ xuất hiện ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="space-y-3 border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại..."
          />
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          <span className="font-medium text-[var(--foreground)]">
            {filtered.length}
          </span>
          {filtered.length !== data.length ? ` / ${data.length}` : ""} liên hệ
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Thời gian", "Người gửi", "Liên hệ", "Nguồn", "Trạng thái", "Nội dung"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="align-top transition-colors hover:bg-[var(--muted)]/30"
              >
                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {item.name}
                    </p>
                    {item.company && (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {item.company}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--foreground)]">
                  <div className="space-y-1">
                    <p>{item.email}</p>
                    {item.phone && (
                      <p className="text-[var(--muted-foreground)]">{item.phone}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="rounded-md bg-[var(--muted)] px-2 py-1 font-mono text-xs">
                    {item.source}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success">
                    {item.status === "new" ? "Mới" : item.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--foreground)]">
                  <p className="max-w-[420px] whitespace-pre-line leading-6">
                    {item.message}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
