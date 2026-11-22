import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthShell from "@/components/AuthShell";
import ResendForm from "@/components/ResendForm";
import { AlertIcon, CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const first = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v;

  const errorMessage =
    first(params.error_description) ||
    first(params.error_code) ||
    first(params.error);

  if (errorMessage) {
    return (
      <AuthShell
        eyebrow="Email confirmation"
        title="That link didn't work"
        subtitle="The confirmation link is invalid or has expired. Enter your email below and we'll send a fresh one."
        footer={
          <>
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Log in instead
            </Link>
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
          <span className="break-words">{errorMessage}</span>
        </div>
        <ResendForm />
      </AuthShell>
    );
  }

  if (first(params.resent)) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="A fresh link is on its way"
        subtitle="We sent a new confirmation link to your email. Open it to activate — or sign in to — your account."
        footer={
          <>
            <Link
              href="/login"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Back to log in
            </Link>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-8 text-center" style={{ background: "var(--success-soft)" }}>
          <span
            className="grid h-14 w-14 place-items-center rounded-full"
            style={{ background: "var(--success)", color: "#fff" }}
          >
            <CheckIcon width={28} height={28} />
          </span>
          <p className="font-display text-lg font-semibold" style={{ color: "var(--success)" }}>
            Confirmation email sent
          </p>
          <p className="max-w-xs text-sm" style={{ color: "var(--muted)" }}>
            Didn&apos;t get it? Check spam, or request another link below.
          </p>
        </div>
        <div className="mt-6">
          <ResendForm />
        </div>
      </AuthShell>
    );
  }

  if (user) redirect("/todos");
  redirect("/login");
}