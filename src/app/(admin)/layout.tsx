/**
 * @nhom        : Admin
 * @chucnang    : Admin layout — Sidebar + Header + Main content
 * @lienquan    : src/components/admin/Sidebar.tsx, src/components/admin/Header.tsx
 * @alias       : admin-layout, dashboard-layout
 */
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar — navigation bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header — thanh trên cùng */}
        <Header />

        {/* Main content — cuộn được */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
