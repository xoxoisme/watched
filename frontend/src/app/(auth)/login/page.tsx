"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { login, fetchMyProfile } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
      return;
    }
    setSubmitting(true);
    try {
      const { accessToken } = await login({ email, password });
      setToken(accessToken);
      const profile = await fetchMyProfile();
      setUser(profile);
      router.push(next);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (!e.response) {
        setError(
          "서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요."
        );
      } else if (e.response.status === 404) {
        setError("등록되지 않은 이메일입니다.");
      } else if (e.response.status === 400) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError(e.response.data?.message ?? "로그인에 실패했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-md bg-black/75 px-8 py-12 backdrop-blur md:px-14 md:py-16">
      <h1 className="mb-8 text-3xl font-bold">로그인</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
        />
        <input
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
        />

        {error && (
          <p className="rounded bg-yellow-600/20 px-3 py-2 text-xs text-yellow-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3 text-sm font-semibold transition hover:bg-accent/90 disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          로그인
        </button>
      </form>

      <div className="mt-12 text-sm text-white/60">
        Watched가 처음이신가요?{" "}
        <Link href="/signup" className="text-white hover:underline">
          지금 가입하세요
        </Link>
        .
      </div>
    </div>
  );
}
