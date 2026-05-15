/**
 * @nhom        : App
 * @chucnang    : Root layout — layout chung cho toàn bộ ứng dụng
 * @lienquan    : src/app/globals.css
 * @alias       : root-layout
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Font Inter — hiện đại, dễ đọc, tối ưu cho admin UI
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

// SEO metadata mặc định
export const metadata: Metadata = {
  title: {
    default: "ADMINMANAGER — Hệ thống quản lý nội dung",
    template: "%s | ADMINMANAGER",
  },
  description:
    "Hệ thống CMS quản lý nội dung trang web doanh nghiệp công nghệ",
};

/**
 * Root layout — bọc toàn bộ ứng dụng
 * Áp dụng font Inter và CSS variables
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
