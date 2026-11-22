"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";
import ResendForm from "@/components/ResendForm";
import { AlertIcon, LockIcon, MailIcon } from "@/components/icons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý callback từ Supabase (nhấn vào liên kết xác nhận trong email).
  // Supabase gửi kết quả cả trong query string (?error=..., ?auth_code=...)
  // lẫn hash fragment (#error=..., #sb=...). Hash không gửi đến server nên
  // phải đọc ở client.
  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      const errorType = searchParams.get("error");
      const errorCode = searchParams.get("error_code");
      const errorDescription = searchParams.get("error_description");
      const authCode = searchParams.get("auth_code");
      const resentParam = searchParams.get("resent");

      // Đọc thêm từ hash fragment (Supabase gắn kèm #error=...&sb=...)
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
      const hashError =
        hashParams.get("error_description") ||
        hashParams.get("error_code") ||
        hashParams.get("error");

      const finalError =
        errorDescription ||
        errorCode ||
        errorType ||
        hashError;

      if (finalError) {
        if (mounted) setError(finalError);
        return;
      }

      if (resentParam === "1") {
        if (mounted) setResent(true);
        return;
      }

      // Xác nhận thành công: hoán đổi mã auth_code thành session.
      if (authCode) {
        const supabase = createClient();
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(authCode);
        if (mounted) {
          if (exchangeError) {
            setError(exchangeError.message);
          } else {
            router.push("/todos");
            router.refresh();
          }
        }
      }
    };

    handleAuthCallback();
    return () => {
      mounted = false;
    };
  }, [searchParams, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/todos");
    router.refresh();
  }

  // Nếu đang ở trạng thái lỗi xác thực (link hết hạn / không hợp lệ), chỉ
  // hiển thị thông báo + form gửi lại + nút đăng nhập bằng mật khẩu.
  if (error) {
    return (
      <AuthShell
        eyebrow="Email confirmation"
        title="That link didn't work"
        subtitle="The confirmation link is invalid or has expired. Enter your email below and we'll send a fresh one."
        footer={
          <>
            Or{" "}
            <button
              type="button"
              onClick={() => setError(null)}
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--accent)" }}
            >
              log in with your password
            </button>
          </>
        }
      >
        <div
          className="mb-6 flex items-start gap-3 rounded-xl px-3.5 py-3 text-sm"
          style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
          role="alert"
        >
          <span className="mt-0.5 flex-none">
            <AlertIcon width={18} height={18} />
          </span>
          <span className="break-words">{error}</span>
        </div>
        <ResendForm />
      </AuthShell>
    );
  }

  // Gửi lại liên kết thành công.
  if (resent) {
    return (
      <AuthShell
        eyebrow="Email confirmation"
        title="Đã gửi lại liên kết"
        subtitle="Liên kết xác nhận mới đã được gửi vào email của bạn. Vui lòng kiểm tra hòm thư và nhấn vào liên kết để kích hoạt / đăng nhập tài khoản."
        footer={
          <a
            href="/login"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Quay lại trang đăng nhập
          </a>
        }
      >
        <div className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
          Kiểm tra email của bạn và nhấn vào liên kết xác nhận.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Inkwell"
      subtitle="Pick up right where you left off."
      footer={
        <>
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--faint)" }}
            >
              <MailIcon />
            </span>
            <input
              id="email"
              className="text-input"
              style={{ paddingLeft: "2.5rem" }}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--faint)" }}
            >
              <LockIcon />
            </span>
            <input
              id="password"
              className="text-input"
              style={{ paddingLeft: "2.5rem" }}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="btn-primary w-full"
          style={{ padding: "0.7rem 1rem" }}
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center">
          <span style={{ color: "var(--muted)" }}>Loading…</span>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}