"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";
import { AlertIcon, LockIcon, MailIcon } from "@/components/icons";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push("/todos");
      router.refresh();
    } else {
      // mailer_autoconfirm=false: chờ xác nhận email, không có session ngay lập tức.
      setEmailSent(true);
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Start clearing your mind, one task at a time."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Log in
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
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
        </div>

        {error && (
          <div
            className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm"
            style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
            role="alert"
          >
            <span className="mt-0.5 flex-none">
              <AlertIcon width={16} height={16} />
            </span>
            <span>{error}</span>
          </div>
        )}

        {emailSent && (
          <div
            className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm"
            style={{ background: "var(--success-soft)", color: "var(--success)" }}
            role="status"
          >
            <span className="mt-0.5 flex-none">
              <MailIcon width={16} height={16} />
            </span>
            <span>Đã gửi liên kết xác nhận. Vui lòng kiểm tra email của bạn và nhấn vào liên kết để kích hoạt tài khoản, sau đó đăng nhập.</span>
          </div>
        )}

        <button
          disabled={loading}
          className="btn-primary w-full"
          style={{ padding: "0.7rem 1rem" }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}