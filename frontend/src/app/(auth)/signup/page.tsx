"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup({ email, password, nickname, birthDate });
      router.push("/login?signup=success");
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
        code?: string;
      };
      if (!e.response) {
        setError(
          "서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요."
        );
      } else {
        setError(e.response.data?.message ?? "회원가입에 실패했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-md bg-black/75 px-8 py-12 backdrop-blur md:px-14 md:py-16">
      <h1 className="mb-2 text-3xl font-bold">회원가입</h1>
      <p className="mb-8 text-sm text-white/60">
        Watched에서 시청 기록을 아카이빙해보세요.
      </p>

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
          placeholder="비밀번호 (8~20자)"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={20}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
        />
        <input
          type="text"
          placeholder="닉네임 (최대 20자)"
          required
          maxLength={20}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
        />
        <div>
          <label className="mb-1 block text-xs text-white/60">생년월일</label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
          />
        </div>

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
          가입하기
        </button>
      </form>

      <div className="mt-12 text-sm text-white/60">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-white hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
