"use client";

import { useState, useTransition } from "react";
import { addTodo, toggleTodo, editTodo, deleteTodo } from "@/app/todos/actions";
import TodoItem from "@/components/TodoItem";
import { InboxIcon, PlusIcon } from "@/components/icons";

type Todo = { id: string; title: string; is_done: boolean };
type Filter = "all" | "active" | "completed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");
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

  const total = todos.length;
  const done = todos.filter((t) => t.is_done).length;
  const activeCount = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const counts: Record<Filter, number> = {
    all: total,
    active: activeCount,
    completed: done,
  };

  const filtered = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.is_done : t.is_done
  );

  const allDone = total > 0 && activeCount === 0;

  return (
    <div>
      {/* Progress header */}
      <div className="mb-6">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Today&apos;s progress
            </p>
            <p className="mt-1 font-display text-lg font-semibold">
              {allDone
                ? "Everything's done. Nice work."
                : done === 0
                  ? "Let's make a start."
                  : `${done} of ${total} done`}
            </p>
          </div>
          <span
            className="font-display text-2xl font-bold tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {pct}%
          </span>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Completion progress"
        >
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          className="text-input"
          placeholder="What needs doing?"
          aria-label="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary flex-none"
          aria-label="Add task"
          disabled={!title.trim()}
        >
          <PlusIcon width={18} height={18} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* Filters */}
      <div className="mb-2 flex">
        <div className="segmented" role="group" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <ul className="-mx-2">
          {filtered.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={(v) => {
                setTodos((prev) =>
                  prev.map((x) => (x.id === t.id ? { ...x, is_done: v } : x))
                );
                startTransition(() => toggleTodo(t.id, v));
              }}
              onEdit={(nt) => {
                setTodos((prev) =>
                  prev.map((x) => (x.id === t.id ? { ...x, title: nt } : x))
                );
                startTransition(() => editTodo(t.id, nt));
              }}
              onDelete={() => {
                setTodos((prev) => prev.filter((x) => x.id !== t.id));
                startTransition(() => deleteTodo(t.id));
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <span
            className="mb-4 grid h-16 w-16 place-items-center rounded-2xl"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <InboxIcon />
          </span>
          <p className="font-display text-lg font-semibold">
            {total === 0
              ? "A clean slate."
              : filter === "completed"
                ? "Nothing completed yet."
                : "All clear."}
          </p>
          <p className="mt-1 max-w-xs text-sm" style={{ color: "var(--muted)" }}>
            {total === 0
              ? "Add your first task above and take it one step at a time."
              : filter === "completed"
                ? "Check off a task and it'll show up here."
                : "You've finished everything on this list."}
          </p>
        </div>
      )}
    </div>
  );
}