import ThemeToggle from "@/components/ThemeToggle";
import { CheckIcon, LogoMark } from "@/components/icons";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const perks = [
  "Capture tasks the moment they come to mind",
  "Watch your progress fill up as you go",
  "A quiet space — no clutter, no noise",
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh w-full px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl items-center justify-center">
        <div className="card grid w-full overflow-hidden md:grid-cols-2 animate-rise">
          {/* Brand panel */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-canvas md:flex">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(70% 60% at 20% 0%, var(--accent-ring), transparent 60%), radial-gradient(60% 50% at 100% 100%, var(--canvas-glow-2), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span style={{ color: "var(--accent)" }}>
                  <LogoMark width={30} height={30} />
                </span>
                <span className="font-display text-lg font-semibold tracking-tight">
                  Inkwell
                </span>
              </div>
            </div>

            <div className="relative mt-10">
              <h2 className="font-display text-3xl font-semibold leading-tight">
                A little less in your head.
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-70">
                A small, focused place to put everything you need to do — so you
                can get back to the things that matter.
              </p>
              <ul className="mt-8 space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm">
                    <span
                      className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full"
                      style={{ background: "var(--success)", color: "#fff" }}
                    >
                      <CheckIcon width={13} height={13} />
                    </span>
                    <span className="opacity-90">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative mt-10 text-xs opacity-50">
              Focus on what&apos;s next, one task at a time.
            </p>
          </aside>

          {/* Form panel */}
          <section className="flex flex-col p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2.5 md:invisible">
                <span style={{ color: "var(--accent)" }}>
                  <LogoMark width={28} height={28} />
                </span>
                <span className="font-display text-lg font-semibold tracking-tight">
                  Inkwell
                </span>
              </div>
              <ThemeToggle />
            </div>

            <div className="mx-auto w-full max-w-sm">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                {eyebrow}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {subtitle}
              </p>

              <div className="mt-8">{children}</div>

              <div
                className="mt-6 text-center text-sm"
                style={{ color: "var(--muted)" }}
              >
                {footer}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}