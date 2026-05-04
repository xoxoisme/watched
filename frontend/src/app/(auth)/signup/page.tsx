"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { signup, requestEmailVerify, confirmEmailVerify } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

  const startTimer = () => {
    setTimer(300);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleSendCode = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    setSendingCode(true);
    try {
      await requestEmailVerify(email);
      setCodeSent(true);
      setCode("");
      startTimer();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "인증 코드 발송에 실패했습니다.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleConfirmCode = async () => {
    setError(null);
    setConfirmingCode(true);
    try {
      await confirmEmailVerify(email, code);
      setEmailVerified(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "인증에 실패했습니다.");
    } finally {
      setConfirmingCode(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setSubmitting(true);
    try {
      const birthDate = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;
      await signup({ email, password, nickname, birthDate });
      router.push(`/login?next=/onboarding&email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
        code?: string;
      };
      if (!e.response) {
        setError("서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.");
      } else {
        setError(e.response.data?.message ?? "회원가입에 실패했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-md rounded-md bg-black/75 px-8 py-12 backdrop-blur md:px-14 md:py-16">
      <h1 className="mb-2 text-3xl font-bold">회원가입</h1>
      <p className="mb-8 text-sm text-white/60">
        Watched에서 시청 기록을 아카이빙해보세요.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* 이메일 + 인증 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="이메일"
              autoComplete="email"
              required
              disabled={emailVerified}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setCodeSent(false); setEmailVerified(false); }}
              className="flex-1 rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40 disabled:opacity-50"
            />
            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!email || sendingCode}
                className="shrink-0 rounded bg-white/15 px-4 py-3.5 text-sm font-semibold transition hover:bg-white/25 disabled:opacity-40"
              >
                {sendingCode ? <Loader2 size={14} className="animate-spin" /> : codeSent ? "재발송" : "코드 발송"}
              </button>
            )}
          </div>

          {emailVerified && (
            <div className="flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle size={15} />
              이메일 인증 완료
            </div>
          )}

          {codeSent && !emailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증 코드 6자리"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="flex-1 rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
              />
              <div className="flex shrink-0 items-center gap-2">
                <span className={`text-sm font-mono ${timer <= 60 ? "text-red-400" : "text-white/50"}`}>
                  {formatTimer(timer)}
                </span>
                <button
                  type="button"
                  onClick={handleConfirmCode}
                  disabled={code.length !== 6 || confirmingCode || timer === 0}
                  className="rounded bg-white/15 px-4 py-3.5 text-sm font-semibold transition hover:bg-white/25 disabled:opacity-40"
                >
                  {confirmingCode ? <Loader2 size={14} className="animate-spin" /> : "인증"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 나머지 필드 — 이메일 인증 완료 후 표시 */}
        {emailVerified && (
          <>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 (8~20자)"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded bg-white/10 px-4 py-3.5 pr-11 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="비밀번호 확인"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={`w-full rounded bg-white/10 px-4 py-3.5 pr-11 text-sm outline-none ring-1 transition placeholder:text-white/50 focus:bg-white/15 ${
                  passwordConfirm && password !== passwordConfirm
                    ? "ring-red-500/60"
                    : "ring-transparent focus:ring-white/40"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="mt-1 text-xs text-red-400">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
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
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="연도"
                  required
                  min={1900}
                  max={2099}
                  value={birthYear}
                  onChange={(e) => { if (e.target.value.length <= 4) setBirthYear(e.target.value); }}
                  className="w-28 rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
                />
                <input
                  type="number"
                  placeholder="월"
                  required
                  min={1}
                  max={12}
                  value={birthMonth}
                  onChange={(e) => { if (e.target.value.length <= 2) setBirthMonth(e.target.value); }}
                  className="w-20 rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
                />
                <input
                  type="number"
                  placeholder="일"
                  required
                  min={1}
                  max={31}
                  value={birthDay}
                  onChange={(e) => { if (e.target.value.length <= 2) setBirthDay(e.target.value); }}
                  className="flex-1 rounded bg-white/10 px-4 py-3.5 text-sm outline-none ring-1 ring-transparent transition placeholder:text-white/50 focus:bg-white/15 focus:ring-white/40"
                />
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="rounded bg-yellow-600/20 px-3 py-2 text-xs text-yellow-300">
            {error}
          </p>
        )}

        {emailVerified && (
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3 text-sm font-semibold transition hover:bg-accent/90 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            가입하기
          </button>
        )}
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
