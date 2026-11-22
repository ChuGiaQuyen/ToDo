import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TodoList from "@/components/TodoList";

export const dynamic = "force-dynamic";

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <form action="/auth/signout" method="post">
          <button className="text-sm underline">Sign out</button>
        </form>
      </div>
      <TodoList initialTodos={todos ?? []} />
    </main>
  );
}
