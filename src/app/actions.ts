"use server";

import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema";

export async function addTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = Number(formData.get("priority") ?? 2);
  if (!title) return;
  await db.insert(tasks).values({
    title: title.slice(0, 200),
    description: description.slice(0, 1000),
    priority: [1, 2, 3].includes(priority) ? priority : 2,
  });
  revalidatePath("/");
}

export async function toggleTask(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.update(tasks).set({ done: not(tasks.done) }).where(eq(tasks.id, id));
  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
}
