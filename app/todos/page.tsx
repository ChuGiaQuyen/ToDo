import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TodoList from "@/components/TodoList";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoMark, LogOutIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const firstName = user.email?.split("@")[0] ?? "there";
  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="animate-rise">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span style={{ color: "var(--accent)" }}>
              <LogoMark width={32} height={32} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Inkwell
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="icon-btn"
                style={{ opacity: 1 }}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOutIcon width={18} height={18} />
              </button>
            </form>
          </div>
        </header>

        {/* Greeting */}
        <div className="mb-6">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            {dateLabel}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {greeting()}, {firstName}.
          </h1>
        </div>

        {/* Card */}
        <section className="card p-5 sm:p-7">
          <TodoList initialTodos={todos ?? []} />
        </section>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--faint)" }}>
          Signed in as {user.email}
        </p>
      </div>
    </main>
  );
}