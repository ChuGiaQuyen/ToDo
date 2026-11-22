create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) > 0),
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists todos_user_id_created_at_idx on public.todos (user_id, created_at desc);
alter table public.todos enable row level security;

drop policy if exists "todos_select_own" on public.todos;
create policy "todos_select_own" on public.todos for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "todos_insert_own" on public.todos;
create policy "todos_insert_own" on public.todos for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "todos_update_own" on public.todos;
create policy "todos_update_own" on public.todos for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "todos_delete_own" on public.todos;
create policy "todos_delete_own" on public.todos for delete to authenticated using ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.todos to authenticated;
