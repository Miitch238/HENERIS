-- ============================================================================
--  Heneris — schéma initial (lot 2)
--  À exécuter dans Supabase → SQL Editor (une seule fois).
--
--  7 tables · toutes en RLS · rien n'est lisible sans politique explicite.
--  Le rôle vit dans `profiles`. Les données spécifiques shopper dans
--  `shopper_profiles`. Modération manuelle via le dashboard Supabase
--  (clé service = contourne la RLS).
-- ============================================================================

-- ── Énumérations ────────────────────────────────────────────────────────────
create type public.user_role      as enum ('client', 'shopper');
create type public.shopper_status as enum ('en_revue', 'actif', 'refuse', 'suspendu');
create type public.availability    as enum ('ouvert', 'complet', 'pause');

-- ── 1 · profiles ────────────────────────────────────────────────────────────
--  1 pour 1 avec auth.users. Créé automatiquement par trigger à l'inscription.
create table public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users (id) on delete cascade,
  role        public.user_role not null default 'client',
  prenom      text not null default '',
  nom         text not null default '',
  avatar_url  text,
  ville       text,
  created_at  timestamptz not null default now()
);

-- ── 2 · shopper_profiles ────────────────────────────────────────────────────
--  1 pour 1 avec un profile de rôle 'shopper'.
create table public.shopper_profiles (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null unique references public.profiles (id) on delete cascade,
  slug          text not null unique,
  titre         text not null default '',
  bio           text not null default '',
  specialites   text[] not null default '{}',
  styles        text[] not null default '{}',
  budget_min    numeric(10, 2),
  budget_max    numeric(10, 2),
  disponibilite public.availability   not null default 'ouvert',
  statut        public.shopper_status not null default 'en_revue',
  note_moyenne  numeric(3, 2),          -- dénormalisé, maj par trigger
  nb_avis       integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint budget_coherent check (
    budget_min is null or budget_max is null or budget_min <= budget_max
  )
);

-- ── 3 · portfolio_items ─────────────────────────────────────────────────────
create table public.portfolio_items (
  id          uuid primary key default gen_random_uuid(),
  shopper_id  uuid not null references public.shopper_profiles (id) on delete cascade,
  image_path  text not null,           -- chemin dans le bucket Storage 'portfolios'
  legende     text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── 4 · conversations ───────────────────────────────────────────────────────
--  Un fil unique par couple client / shopper.
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.profiles (id) on delete cascade,
  shopper_id      uuid not null references public.profiles (id) on delete cascade,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (client_id, shopper_id),
  constraint pas_soi_meme check (client_id <> shopper_id)
);

-- ── 5 · briefs ──────────────────────────────────────────────────────────────
--  Besoin structuré, 0 ou 1 par conversation (optionnel).
create table public.briefs (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique references public.conversations (id) on delete cascade,
  categorie       text not null,
  budget_min      numeric(10, 2),
  budget_max      numeric(10, 2),
  description     text not null default '',
  delai           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── 6 · messages ────────────────────────────────────────────────────────────
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  contenu         text not null check (char_length(contenu) between 1 and 4000),
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- ── 7 · reviews ─────────────────────────────────────────────────────────────
--  Un seul avis par couple client / shopper (anti-spam).
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  shopper_id  uuid not null references public.profiles (id) on delete cascade,
  client_id   uuid not null references public.profiles (id) on delete cascade,
  note        smallint not null check (note between 1 and 5),
  commentaire text not null default '',
  created_at  timestamptz not null default now(),
  unique (client_id, shopper_id)
);

-- ── Index ───────────────────────────────────────────────────────────────────
create index idx_profiles_user_id          on public.profiles (user_id);
create index idx_shopper_profiles_statut    on public.shopper_profiles (statut);
create index idx_shopper_profiles_dispo     on public.shopper_profiles (disponibilite);
create index idx_portfolio_shopper          on public.portfolio_items (shopper_id, position);
create index idx_conversations_client       on public.conversations (client_id, last_message_at desc);
create index idx_conversations_shopper      on public.conversations (shopper_id, last_message_at desc);
create index idx_messages_conversation      on public.messages (conversation_id, created_at);
create index idx_reviews_shopper            on public.reviews (shopper_id);

-- ============================================================================
--  FONCTIONS & TRIGGERS
-- ============================================================================

-- Helper : id du profil de l'utilisateur connecté (utilisé par les policies).
create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where user_id = auth.uid()
$$;

-- Création automatique du profil à l'inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  wanted_role text := nullif(new.raw_user_meta_data ->> 'role', '');
begin
  insert into public.profiles (user_id, role, prenom, nom)
  values (
    new.id,
    case when wanted_role in ('client', 'shopper')
         then wanted_role::public.user_role
         else 'client' end,
    coalesce(new.raw_user_meta_data ->> 'prenom', ''),
    coalesce(new.raw_user_meta_data ->> 'nom', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- `updated_at` automatique.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_shopper_profiles before update on public.shopper_profiles
  for each row execute function public.touch_updated_at();
create trigger touch_briefs before update on public.briefs
  for each row execute function public.touch_updated_at();

-- Empêche un shopper de modifier lui-même son statut de modération.
-- Seule la clé service (auth.uid() is null) peut changer `statut`.
create or replace function public.protect_shopper_statut()
returns trigger
language plpgsql
as $$
begin
  if new.statut is distinct from old.statut and auth.uid() is not null then
    new.statut = old.statut;
  end if;
  return new;
end;
$$;

create trigger protect_statut before update on public.shopper_profiles
  for each row execute function public.protect_shopper_statut();

-- Remonte la conversation à chaque nouveau message.
create or replace function public.bump_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
     set last_message_at = new.created_at
   where id = new.conversation_id;
  return new;
end;
$$;

create trigger bump_conversation_on_message after insert on public.messages
  for each row execute function public.bump_conversation();

-- Recalcule note_moyenne / nb_avis du shopper à chaque changement d'avis.
create or replace function public.refresh_shopper_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile_id uuid := coalesce(new.shopper_id, old.shopper_id);
begin
  update public.shopper_profiles sp
     set note_moyenne = agg.moy,
         nb_avis      = agg.n
    from (
      select round(avg(note)::numeric, 2) as moy, count(*) as n
        from public.reviews
       where shopper_id = target_profile_id
    ) agg
   where sp.profile_id = target_profile_id;
  return coalesce(new, old);
end;
$$;

create trigger refresh_rating_on_review
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_shopper_rating();

-- ============================================================================
--  ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles         enable row level security;
alter table public.shopper_profiles enable row level security;
alter table public.portfolio_items  enable row level security;
alter table public.conversations    enable row level security;
alter table public.briefs           enable row level security;
alter table public.messages         enable row level security;
alter table public.reviews          enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
create policy "profiles: lecture de soi"
  on public.profiles for select
  using (user_id = auth.uid());

create policy "profiles: lecture des shoppers actifs"
  on public.profiles for select
  using (
    exists (
      select 1 from public.shopper_profiles sp
       where sp.profile_id = profiles.id and sp.statut = 'actif'
    )
  );

create policy "profiles: modification de soi"
  on public.profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── shopper_profiles ────────────────────────────────────────────────────────
create policy "shopper_profiles: lecture publique si actif"
  on public.shopper_profiles for select
  using (statut = 'actif');

create policy "shopper_profiles: lecture de son propre profil"
  on public.shopper_profiles for select
  using (profile_id = public.current_profile_id());

create policy "shopper_profiles: création par le shopper"
  on public.shopper_profiles for insert
  with check (
    profile_id = public.current_profile_id()
    and exists (
      select 1 from public.profiles p
       where p.id = profile_id and p.role = 'shopper'
    )
  );

create policy "shopper_profiles: modification de son profil"
  on public.shopper_profiles for update
  using (profile_id = public.current_profile_id())
  with check (profile_id = public.current_profile_id());
--  (le trigger protect_statut empêche la modification de `statut`)

-- ── portfolio_items ─────────────────────────────────────────────────────────
create policy "portfolio: lecture si shopper actif ou propriétaire"
  on public.portfolio_items for select
  using (
    exists (
      select 1 from public.shopper_profiles sp
       where sp.id = portfolio_items.shopper_id
         and (sp.statut = 'actif' or sp.profile_id = public.current_profile_id())
    )
  );

create policy "portfolio: écriture par le propriétaire"
  on public.portfolio_items for all
  using (
    exists (
      select 1 from public.shopper_profiles sp
       where sp.id = portfolio_items.shopper_id
         and sp.profile_id = public.current_profile_id()
    )
  )
  with check (
    exists (
      select 1 from public.shopper_profiles sp
       where sp.id = portfolio_items.shopper_id
         and sp.profile_id = public.current_profile_id()
    )
  );

-- ── conversations ───────────────────────────────────────────────────────────
create policy "conversations: lecture par les participants"
  on public.conversations for select
  using (
    client_id = public.current_profile_id()
    or shopper_id = public.current_profile_id()
  );

create policy "conversations: création par le client vers un shopper actif"
  on public.conversations for insert
  with check (
    client_id = public.current_profile_id()
    and exists (
      select 1 from public.profiles p
       where p.id = client_id and p.role = 'client'
    )
    and exists (
      select 1 from public.shopper_profiles sp
       where sp.profile_id = conversations.shopper_id and sp.statut = 'actif'
    )
  );

-- ── briefs ──────────────────────────────────────────────────────────────────
create policy "briefs: lecture par les participants"
  on public.briefs for select
  using (
    exists (
      select 1 from public.conversations c
       where c.id = briefs.conversation_id
         and (c.client_id = public.current_profile_id()
              or c.shopper_id = public.current_profile_id())
    )
  );

create policy "briefs: écriture par le client de la conversation"
  on public.briefs for all
  using (
    exists (
      select 1 from public.conversations c
       where c.id = briefs.conversation_id
         and c.client_id = public.current_profile_id()
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
       where c.id = briefs.conversation_id
         and c.client_id = public.current_profile_id()
    )
  );

-- ── messages ────────────────────────────────────────────────────────────────
create policy "messages: lecture par les participants"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
       where c.id = messages.conversation_id
         and (c.client_id = public.current_profile_id()
              or c.shopper_id = public.current_profile_id())
    )
  );

create policy "messages: envoi par un participant"
  on public.messages for insert
  with check (
    sender_id = public.current_profile_id()
    and exists (
      select 1 from public.conversations c
       where c.id = messages.conversation_id
         and (c.client_id = public.current_profile_id()
              or c.shopper_id = public.current_profile_id())
    )
  );

create policy "messages: marquer comme lu par le destinataire"
  on public.messages for update
  using (
    sender_id <> public.current_profile_id()
    and exists (
      select 1 from public.conversations c
       where c.id = messages.conversation_id
         and (c.client_id = public.current_profile_id()
              or c.shopper_id = public.current_profile_id())
    )
  );

-- ── reviews ─────────────────────────────────────────────────────────────────
create policy "reviews: lecture publique"
  on public.reviews for select
  using (true);

create policy "reviews: dépôt par un client ayant une conversation"
  on public.reviews for insert
  with check (
    client_id = public.current_profile_id()
    and exists (
      select 1 from public.profiles p
       where p.id = client_id and p.role = 'client'
    )
    and exists (
      select 1 from public.conversations c
       where c.client_id = reviews.client_id
         and c.shopper_id = reviews.shopper_id
    )
  );

create policy "reviews: modification de son avis"
  on public.reviews for update
  using (client_id = public.current_profile_id())
  with check (client_id = public.current_profile_id());

create policy "reviews: suppression de son avis"
  on public.reviews for delete
  using (client_id = public.current_profile_id());

-- ============================================================================
--  REALTIME
-- ============================================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
