"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookMarked, Heart, Star, Eye } from "lucide-react";
import Header from "@/components/Header";
import { useAuthStore } from "@/stores/authStore";

const MENU = [
  { href: "/my/watch", icon: Eye, label: "시청 기록", desc: "시청 중 · 완료 · 볼 예정 · 하차" },
  { href: "/my/favorites", icon: Heart, label: "즐겨찾기", desc: "내가 즐겨찾기한 콘텐츠" },
  { href: "/my/reviews", icon: BookMarked, label: "내 리뷰", desc: "내가 작성한 리뷰 모음" },
];

export default function MePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) router.push("/login");
  }, [accessToken, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12 max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-2xl font-black">
            {user.nickname[0]}
          </div>
          <div>
            <p className="text-xl font-bold">{user.nickname}</p>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          {MENU.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-lg bg-white/5 px-5 py-4 transition hover:bg-white/10"
            >
              <Icon size={20} className="shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-white/50">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
