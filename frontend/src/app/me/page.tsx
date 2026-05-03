"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookMarked, Heart, Eye, Camera, Check, X, Loader2, User, FolderOpen } from "lucide-react";
import Header from "@/components/Header";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile } from "@/lib/auth";

const MENU = [
  { href: "/my/watch", icon: Eye, label: "시청 기록" },
  { href: "/my/favorites", icon: Heart, label: "즐겨찾기" },
  { href: "/collections/me", icon: FolderOpen, label: "내 컬렉션" },
  { href: "/my/reviews", icon: BookMarked, label: "내 리뷰" },
];

export default function MePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [editingImage, setEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!accessToken) router.push("/login");
  }, [accessToken, router]);

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 200;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImageUrl(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({
        nickname: user.nickname,
        profileImageUrl: imageUrl || null,
      });
      setUser(updated);
      setEditingImage(false);
      setImageUrl("");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelImage = () => {
    setEditingImage(false);
    setImageUrl("");
  };

  const previewUrl = imageUrl || user.profileImageUrl;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12 max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="relative group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={user.nickname}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10">
                <User size={28} className="text-white/60" />
              </div>
            )}
            {!editingImage && (
              <button
                onClick={() => setEditingImage(true)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition"
              >
                <Camera size={18} />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold">{user.nickname}</p>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
        </div>

        {editingImage && (
          <div className="mb-6 rounded-lg bg-white/5 p-4 space-y-3">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">프로필 이미지 변경</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded bg-white/10 py-2.5 text-sm hover:bg-white/15 transition"
            >
              파일 선택
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imageUrl && (
              <div className="flex justify-center">
                <img src={imageUrl} alt="미리보기" className="h-20 w-20 rounded-full object-cover" />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelImage}
                className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-white/60 hover:text-white"
              >
                <X size={13} /> 취소
              </button>
              <button
                onClick={handleSaveImage}
                disabled={saving}
                className="flex items-center gap-1 rounded bg-accent px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                저장
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {MENU.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-lg bg-white/5 px-5 py-4 transition hover:bg-white/10"
            >
              <Icon size={20} className="shrink-0 text-white" />
              <p className="text-sm font-semibold">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
