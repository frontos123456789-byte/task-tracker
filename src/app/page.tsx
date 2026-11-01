import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { addTask, deleteTask, toggleTask } from "./actions";

export const dynamic = "force-dynamic";

const PRIORITY = {
  1: { label: "Высокий", cls: "bg-red-100 text-red-700" },
  2: { label: "Обычный", cls: "bg-amber-100 text-amber-700" },
  3: { label: "Низкий", cls: "bg-emerald-100 text-emerald-700" },
} as const;

export default async function HomePage() {
  const list = await db
    .select()
    .from(tasks)
    .orderBy(asc(tasks.done), asc(tasks.priority), desc(tasks.createdAt));

  const doneCount = list.filter((t) => t.done).length;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-950">Трекер задач</h1>
        <p className="mt-1 text-sm text-slate-600">
          Выполнено {doneCount} из {list.length}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: list.length ? `${(doneCount / list.length) * 100}%` : "0%" }}
          />
        </div>
      </header>

      <form action={addTask} className="mb-8 space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <input
          name="title"
          required
          maxLength={200}
          placeholder="Что нужно сделать?"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
        <textarea
          name="description"
          maxLength={1000}
          rows={2}
          placeholder="Описание (необязательно)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
        <div className="flex items-center gap-3">
          <select
            name="priority"
            defaultValue="2"
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="1">Высокий</option>
            <option value="2">Обычный</option>
            <option value="3">Низкий</option>
          </select>
          <button
            type="submit"
            className="ml-auto rounded-lg bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-700"
          >
            Добавить
          </button>
        </div>
      </form>

      {list.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500">Задач пока нет. Добавь первую.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((t) => {
            const p = PRIORITY[t.priority as 1 | 2 | 3] ?? PRIORITY[2];
            return (
              <li key={t.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <form action={toggleTask}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    aria-label="Переключить статус"
                    className={`mt-1 grid h-6 w-6 place-items-center rounded-full border-2 text-xs ${
                      t.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"
                    }`}
                  >
                    {t.done ? "✓" : ""}
                  </button>
                </form>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-medium ${t.done ? "text-slate-400 line-through" : ""}`}>{t.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.cls}`}>{p.label}</span>
                  </div>
                  {t.description && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{t.description}</p>
                  )}
                </div>
                <form action={deleteTask}>
                  <input type="hidden" name="id" value={t.id} />
                  <button type="submit" className="text-sm text-slate-400 hover:text-red-600">
                    Удалить
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
