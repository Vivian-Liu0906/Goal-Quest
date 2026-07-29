-- 给番茄钟记录加上任务名称字段
-- 在 Supabase 的 SQL Editor 里运行（可以安全重复运行）

alter table pomodoro_sessions
  add column if not exists task_name text not null default '';
