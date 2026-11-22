"use client";

import { useState, useTransition } from "react";
import { addTodo, toggleTodo, editTodo, deleteTodo } from "@/app/todos/actions";
import TodoItem from "@/components/TodoItem";
type Todo = { id: string; title: string; is_done: boolean };

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const temp: Todo = { id: crypto.randomUUID(), title: t, is_done: false };
    setTodos((prev) => [temp, ...prev]);
    setTitle("");
    startTransition(async () => {
      await addTodo(t);
    });
  }

  const filtered = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.is_done : t.is_done
  );

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input className="flex-1 border rounded p-2" placeholder="New todo" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="bg-black text-white rounded px-4">Add</button>
      </form>
      <div className="flex gap-2 mb-4 text-sm">
        {(["all", "active", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? "font-bold underline" : ""}>{f}</button>
        ))}
      </div>
      <ul className="space-y-2">
        {filtered.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={(v) => {
              setTodos((prev) => prev.map((x) => (x.id === t.id ? { ...x, is_done: v } : x)));
              startTransition(() => toggleTodo(t.id, v));
            }}
            onEdit={(nt) => {
              setTodos((prev) => prev.map((x) => (x.id === t.id ? { ...x, title: nt } : x)));
              startTransition(() => editTodo(t.id, nt));
            }}
            onDelete={() => {
              setTodos((prev) => prev.filter((x) => x.id !== t.id));
              startTransition(() => deleteTodo(t.id));
            }}
          />
        ))}
      </ul>
      {filtered.length === 0 && <p className="text-gray-500 text-sm mt-4">No todos.</p>}
    </div>
  );
}
