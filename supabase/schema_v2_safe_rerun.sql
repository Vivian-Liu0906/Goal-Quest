-- 安全版：可以重复运行，不会因为表/策略已存在而报错

create table if not exists daily_todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  todo_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null default current_date,
  focus_minutes integer not null default 25,
  completed_at timestamptz not null default now()
);

alter table daily_todos enable row level security;
alter table pomodoro_sessions enable row level security;

drop policy if exists "Users can view own daily_todos" on daily_todos;
drop policy if exists "Users can insert own daily_todos" on daily_todos;
drop policy if exists "Users can update own daily_todos" on daily_todos;
drop policy if exists "Users can delete own daily_todos" on daily_todos;

create policy "Users can view own daily_todos" on daily_todos for select using (auth.uid() = user_id);
create policy "Users can insert own daily_todos" on daily_todos for insert with check (auth.uid() = user_id);
create policy "Users can update own daily_todos" on daily_todos for update using (auth.uid() = user_id);
create policy "Users can delete own daily_todos" on daily_todos for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own pomodoro_sessions" on pomodoro_sessions;
drop policy if exists "Users can insert own pomodoro_sessions" on pomodoro_sessions;
drop policy if exists "Users can delete own pomodoro_sessions" on pomodoro_sessions;

create policy "Users can view own pomodoro_sessions" on pomodoro_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own pomodoro_sessions" on pomodoro_sessions for insert with check (auth.uid() = user_id);
create policy "Users can delete own pomodoro_sessions" on pomodoro_sessions for delete using (auth.uid() = user_id);

grant select, insert, update, delete on daily_todos to authenticated;
grant select, insert, update, delete on pomodoro_sessions to authenticated;
