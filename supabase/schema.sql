-- Goal Quest 数据库结构
-- 在 Supabase 项目的 SQL Editor 里运行这整段脚本

create extension if not exists "pgcrypto";

-- 目标表
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  target_xp integer not null default 100,
  color text not null default 'teal',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- 任务表
create table tasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  title text not null,
  xp integer not null default 10,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  done_at timestamptz
);

-- 里程碑表
create table milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  title text not null,
  threshold_xp integer not null
);

-- 开启行级安全（Row Level Security）：确保每个用户只能访问自己的数据
alter table goals enable row level security;
alter table tasks enable row level security;
alter table milestones enable row level security;

-- goals 表策略：用户只能操作自己的目标
create policy "Users can view own goals"
  on goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on goals for delete
  using (auth.uid() = user_id);

-- tasks 表策略：通过所属 goal 判断归属
create policy "Users can view own tasks"
  on tasks for select
  using (exists (select 1 from goals where goals.id = tasks.goal_id and goals.user_id = auth.uid()));

create policy "Users can insert own tasks"
  on tasks for insert
  with check (exists (select 1 from goals where goals.id = tasks.goal_id and goals.user_id = auth.uid()));

create policy "Users can update own tasks"
  on tasks for update
  using (exists (select 1 from goals where goals.id = tasks.goal_id and goals.user_id = auth.uid()));

create policy "Users can delete own tasks"
  on tasks for delete
  using (exists (select 1 from goals where goals.id = tasks.goal_id and goals.user_id = auth.uid()));

-- milestones 表策略：通过所属 goal 判断归属
create policy "Users can view own milestones"
  on milestones for select
  using (exists (select 1 from goals where goals.id = milestones.goal_id and goals.user_id = auth.uid()));

create policy "Users can insert own milestones"
  on milestones for insert
  with check (exists (select 1 from goals where goals.id = milestones.goal_id and goals.user_id = auth.uid()));

create policy "Users can delete own milestones"
  on milestones for delete
  using (exists (select 1 from goals where goals.id = milestones.goal_id and goals.user_id = auth.uid()));
