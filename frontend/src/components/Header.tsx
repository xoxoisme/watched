"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookMarked, Eye, FolderOpen, Heart, Search, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { logout as apiLogout } from "@/lib/auth";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "컬렉션", href: "/collections/explore" },
];

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore — server is stateless, clear local state regardless
    }
    clear();
    setMenuOpen(false);
    router.push("/login");
  };

  const isAuthed = hydrated && !!accessToken;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-brand text-4xl tracking-tight text-accent">
            WATCHED
          </Link>
          <nav className="hidden items-center gap-5 text-base md:flex mt-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8 text-white/90">
          <Link href="/search" aria-label="검색" className="hover:text-white -mt-1">
            <Search size={27} />
          </Link>

          {isAuthed ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="rounded hover:opacity-80 transition"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.nickname}
                    className="h-7 w-7 rounded-full object-cover mt-1"
                  />
                ) : (
                  <User size={27} className="text-white/90 hover:text-white" />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-white/10 bg-black/95 shadow-xl backdrop-blur">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold">{user?.nickname}</p>
                    <p className="truncate text-xs text-white/50">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/me"); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10"
                  >
                    <User size={14} /> 프로필
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/my/watch"); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10"
                  >
                    <Eye size={14} /> 시청 기록
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/my/favorites"); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10"
                  >
                    <Heart size={14} /> 즐겨찾기
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/collections/me"); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10"
                  >
                    <FolderOpen size={14} /> 내 컬렉션
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/my/reviews"); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10"
                  >
                    <BookMarked size={14} /> 내 리뷰
                  </button>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10"
                  >
                    <LogOut size={14} /> 로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded px-3 py-1.5 text-sm font-medium hover:text-white/70"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded bg-accent px-3 py-1.5 text-sm font-semibold transition hover:bg-accent/90"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
