-- ============================================================================
--  Heneris — lot 7 : messages du formulaire de contact
--
--  Une table simple, sans UI admin : les messages se lisent et se traitent
--  depuis le dashboard Supabase (la clé service contourne la RLS).
--
--  Insertion ouverte à tout le monde (anon + authenticated) — le contenu est
--  validé côté Server Action (Zod + honeypot + piège temporel). Aucune policy
--  SELECT / UPDATE / DELETE : rien n'est lisible via l'API publique.
--
--  Ré-exécutable.
-- ============================================================================

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  email       text not null,
  sujet       text not null,
  message     text not null,
  auteur_id   uuid references public.profiles (id) on delete set null,
  traite      boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages: tout le monde peut écrire" on public.contact_messages;
create policy "contact_messages: tout le monde peut écrire"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create index if not exists idx_contact_messages_created
  on public.contact_messages (created_at desc);
