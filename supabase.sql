-- =====================================================================
--  Ahorro Inteligente · base de datos en Supabase
--  Cópialo completo en Supabase → SQL Editor → New query → Run.
--  Se puede correr más de una vez sin romper nada.
-- =====================================================================

-- Una fila por documento de cada usuario: 'config' y un documento por mes ('mes_2026_11', ...)
create table if not exists public.docs (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  key        text        not null check (key ~ '^(config|mes_[0-9]{4}_[0-9]{2})$'),
  data       jsonb       not null,
  t          bigint      not null default 0,          -- marca de tiempo del dispositivo (gana la más reciente)
  updated_at timestamptz not null default now(),
  primary key (user_id, key),
  constraint docs_tamano check (pg_column_size(data) < 2000000)   -- máx. ~2 MB por documento
);

-- Seguridad por filas: cada cuenta solo ve y cambia lo suyo
alter table public.docs enable row level security;

drop policy if exists "docs: leer lo mío"     on public.docs;
drop policy if exists "docs: crear lo mío"    on public.docs;
drop policy if exists "docs: cambiar lo mío"  on public.docs;
drop policy if exists "docs: borrar lo mío"   on public.docs;

create policy "docs: leer lo mío"    on public.docs for select to authenticated using ((select auth.uid()) = user_id);
create policy "docs: crear lo mío"   on public.docs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "docs: cambiar lo mío" on public.docs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "docs: borrar lo mío"  on public.docs for delete to authenticated using ((select auth.uid()) = user_id);

-- Quien no ha iniciado sesión no puede tocar la tabla
revoke all on public.docs from anon;
grant select, insert, update, delete on public.docs to authenticated;

-- Comprobación rápida (debe decir rowsecurity = true)
select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'docs';
