-- 猫咪陪伴 + 金币系统
-- 在 Supabase 的 SQL Editor 里运行（可以安全重复运行）

create table if not exists pet_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  coins integer not null default 0,
  equipped_skin text not null default 'default',
  owned_skins text[] not null default array['default'],
  updated_at timestamptz not null default now()
);

alter table pet_state enable row level security;

drop policy if exists "Users can view own pet_state" on pet_state;
drop policy if exists "Users can insert own pet_state" on pet_state;
drop policy if exists "Users can update own pet_state" on pet_state;

create policy "Users can view own pet_state" on pet_state for select using (auth.uid() = user_id);
create policy "Users can insert own pet_state" on pet_state for insert with check (auth.uid() = user_id);
create policy "Users can update own pet_state" on pet_state for update using (auth.uid() = user_id);

grant select, insert, update on pet_state to authenticated;
