-- Livre d’or Art of Flying — à exécuter une fois dans le SQL Editor du projet Supabase.
-- Les visiteurs lisent uniquement les messages approuvés et déposent des messages en attente.
-- L’approbation s’effectue dans le tableau de bord propriétaire, jamais depuis le site public.
begin;
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  author text not null check (char_length(btrim(author)) between 2 and 80),
  message text not null check (char_length(btrim(message)) between 10 and 2000),
  created_at timestamptz not null default now(),
  approved boolean not null default false
);
alter table public.guestbook_entries enable row level security;
revoke all on table public.guestbook_entries from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select (id, author, message, created_at) on public.guestbook_entries to anon, authenticated;
grant insert (author, message) on public.guestbook_entries to anon, authenticated;

drop policy if exists "guestbook_read_approved" on public.guestbook_entries;
create policy "guestbook_read_approved" on public.guestbook_entries
  for select to anon, authenticated using (approved = true);

drop policy if exists "guestbook_submit_pending" on public.guestbook_entries;
create policy "guestbook_submit_pending" on public.guestbook_entries
  for insert to anon, authenticated with check (approved = false);

create index if not exists guestbook_approved_date_idx
  on public.guestbook_entries (created_at desc) where approved = true;
comment on table public.guestbook_entries is 'Livre d’or Art of Flying : publication après validation des artistes.';
commit;
