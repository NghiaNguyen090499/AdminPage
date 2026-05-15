"use client";
/**
 * @nhom        : Admin / Team
 * @chucnang    : Form component dùng chung cho tạo mới + chỉnh sửa thành viên
 * @input       : initialData? (TeamMember) — nếu có = mode sửa, không có = mode tạo
 * @lienquan    : src/lib/actions/team.ts
 * @alias       : team-form, team-editor
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamMember } from "@/types/database";

interface TeamFormProps {
  initialData?: TeamMember;
}

export function TeamForm({ initialData }: TeamFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  // State cho form fields — Thông tin cơ bản
  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  // State cho social links
  const [linkedin, setLinkedin] = useState(initialData?.socialLinks?.linkedin ?? "");
  const [twitter, setTwitter] = useState(initialData?.socialLinks?.twitter ?? "");
  const [github, setGithub] = useState(initialData?.socialLinks?.github ?? "");
  const [website, setWebsite] = useState(initialData?.socialLinks?.website ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Xử lý submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Tạo FormData
    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("position", position);
    formData.set("bio", bio);
    formData.set("avatarUrl", avatarUrl);
    formData.set("email", email);
    formData.set("sortOrder", String(sortOrder));
    formData.set("isPublished", String(isPublished));
    formData.set("socialLinkedin", linkedin);
    formData.set("socialTwitter", twitter);
    formData.set("socialGithub", github);
    formData.set("socialWebsite", website);

    try {
      if (isEdit && initialData) {
        const { updateTeamAction } = await import("@/lib/actions/team");
        const result = await updateTeamAction(initialData.id, formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      } else {
        const { createTeamAction } = await import("@/lib/actions/team");
        const result = await createTeamAction(formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      }
      router.push("/team");
      router.refresh();
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông báo lỗi */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Họ tên */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ tên <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn An"
              required
            />
          </div>

          {/* Chức vụ */}
          <div className="space-y-2">
            <Label htmlFor="position">
              Chức vụ <span className="text-red-400">*</span>
            </Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="CEO, CTO, Lead Developer..."
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.vn"
            />
          </div>

          {/* Tiểu sử */}
          <div className="space-y-2">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Giới thiệu ngắn về thành viên..."
              className="min-h-[120px]"
            />
          </div>

          {/* Avatar — Upload ảnh đại diện */}
          <ImageUpload
            value={avatarUrl}
            onChange={setAvatarUrl}
            folder="team"
            label="Ảnh đại diện"
            description="Ảnh đại diện thành viên — hiển thị trên website"
            previewHeight={180}
          />
        </CardContent>
      </Card>

      {/* Liên kết mạng xã hội */}
      <Card>
        <CardHeader>
          <CardTitle>Mạng xã hội</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </Label>
              <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>

            {/* Twitter/X */}
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </Label>
              <Input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                GitHub
              </Label>
              <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                Website
              </Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cài đặt hiển thị */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
            <Input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              min={0}
              className="w-32"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Hiển thị công khai</Label>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Bật để hiển thị thành viên trên website
              </p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" className="cursor-pointer" onClick={() => router.push("/team")}>
          ← Quay lại
        </Button>
        <Button type="submit" disabled={loading || !fullName || !position} className="cursor-pointer min-w-[120px]">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang lưu...
            </span>
          ) : isEdit ? "Cập nhật" : "Thêm thành viên"}
        </Button>
      </div>
    </form>
  );
}
