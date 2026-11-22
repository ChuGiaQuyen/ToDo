"use client";

import { useState } from "react";

type Todo = { id: string; title: string; is_done: boolean };

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: {
  todo: Todo;
  onToggle: (v: boolean) => void;
  onEdit: (t: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  return (
    <li className="flex items-center gap-2 border rounded p-2">
      <input type="checkbox" checked={todo.is_done} onChange={(e) => onToggle(e.target.checked)} />
      {editing ? (
        <input
          className="flex-1 border rounded p-1"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { onEdit(draft); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { onEdit(draft); setEditing(false); } }}
          autoFocus
        />
      ) : (
        <span className={`flex-1 ${todo.is_done ? "line-through text-gray-400" : ""}`} onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </span>
      )}
      <button onClick={() => setEditing(true)} className="text-sm">Edit</button>
      <button onClick={onDelete} className="text-sm text-red-600">Delete</button>
    </li>
  );
}
