"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getCurrentUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return user;
}

export async function addTodo(title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) throw new Error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
  const { error } = await supabase
    .from("todos")
    .insert({ user_id: user.id, title: trimmed });
  if (error) {
    console.error("[addTodo] supabase insert error:", error);
    throw new Error(error.message);
  }
  revalidatePath("/todos");
}

export async function toggleTodo(id: string, is_done: boolean) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) throw new Error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
  const { error } = await supabase
    .from("todos")
    .update({ is_done })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    console.error("[toggleTodo] supabase update error:", error);
    throw new Error(error.message);
  }
  revalidatePath("/todos");
}

export async function editTodo(id: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) throw new Error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
  const { error } = await supabase
    .from("todos")
    .update({ title: trimmed })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    console.error("[editTodo] supabase update error:", error);
    throw new Error(error.message);
  }
  revalidatePath("/todos");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) throw new Error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    console.error("[deleteTodo] supabase delete error:", error);
    throw new Error(error.message);
  }
  revalidatePath("/todos");
}
