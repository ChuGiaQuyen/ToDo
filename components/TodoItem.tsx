"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";

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

  function commit() {
    const next = draft.trim();
    if (next && next !== todo.title) {
      onEdit(next);
    } else {
      setDraft(todo.title);
    }
    setEditing(false);
  }

  return (
    <li className="todo-row" data-done={todo.is_done}>
      <button
        type="button"
        className="check"
        role="checkbox"
        aria-checked={todo.is_done}
        aria-label={
          todo.is_done
            ? `Mark "${todo.title}" as not done`
            : `Mark "${todo.title}" as done`
        }
        data-checked={todo.is_done}
        onClick={() => onToggle(!todo.is_done)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>

      {editing ? (
        <input
          className="text-input"
          style={{ padding: "0.4rem 0.6rem", fontSize: "0.95rem" }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(todo.title);
              setEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="todo-title"
          onDoubleClick={() => {
            setDraft(todo.title);
            setEditing(true);
          }}
          title="Double-click to edit"
        >
          {todo.title}
        </span>
      )}

      {!editing && (
        <div className="flex flex-none items-center gap-1">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Edit "${todo.title}"`}
            onClick={() => {
              setDraft(todo.title);
              setEditing(true);
            }}
          >
            <PencilIcon width={16} height={16} />
          </button>
          <button
            type="button"
            className="icon-btn"
            data-variant="danger"
            aria-label={`Delete "${todo.title}"`}
            onClick={onDelete}
          >
            <TrashIcon width={16} height={16} />
          </button>
        </div>
      )}
    </li>
  );
}