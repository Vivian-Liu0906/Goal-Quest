import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../i18n";
import { useDailyTodos } from "../useDailyTodos";

export default function DailyTodoPage({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useDailyTodos(userId);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addTodo(input.trim());
    setInput("");
  };

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-neutral-900">{t("todo.title")}</h1>
      <p className="text-sm text-neutral-500 mt-1">{t("todo.subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("todo.addPlaceholder")}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-2 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={15} /> {t("todo.add")}
        </button>
      </form>

      {!loading && todos.length > 0 && (
        <p className="mt-4 text-xs text-neutral-400">
          {doneCount} / {todos.length} {t("todo.doneCount")}
        </p>
      )}

      <div className="mt-3 space-y-2">
        {!loading && todos.length === 0 && (
          <p className="text-sm text-neutral-400 py-10 text-center">{t("todo.empty")}</p>
        )}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                todo.done ? "border-teal-500 bg-teal-500" : "border-neutral-300 hover:border-teal-400"
              }`}
            >
              {todo.done && <Check size={14} className="text-white" />}
            </button>
            <span
              className={`flex-1 text-sm ${
                todo.done ? "line-through text-neutral-400" : "text-neutral-800"
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label={t("todo.delete")}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-500 p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
