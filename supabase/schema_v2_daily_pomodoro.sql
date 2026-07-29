-- 新增：每日待办清单 + 番茄钟记录
-- 在 Supabase 的 SQL Editor 里运行这段脚本

create table daily_todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  todo_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null default current_date,
  focus_minutes integer not null default 25,
  completed_at timestamptz not null default now()
);

alter table daily_todos enable row level security;
alter table pomodoro_sessions enable row level security;

create policy "Users can view own daily_todos" on daily_todos for select using (auth.uid() = user_id);
create policy "Users can insert own daily_todos" on daily_todos for insert with check (auth.uid() = user_id);
create policy "Users can update own daily_todos" on daily_todos for update using (auth.uid() = user_id);
create policy "Users can delete own daily_todos" on daily_todos for delete using (auth.uid() = user_id);

create policy "Users can view own pomodoro_sessions" on pomodoro_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own pomodoro_sessions" on pomodoro_sessions for insert with check (auth.uid() = user_id);
create policy "Users can delete own pomodoro_sessions" on pomodoro_sessions for delete using (auth.uid() = user_id);

grant select, insert, update, delete on daily_todos to authenticated;
grant select, insert, update, delete on pomodoro_sessions to authenticated;
