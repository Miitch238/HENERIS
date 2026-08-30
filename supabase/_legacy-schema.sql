-- ============================================================
-- Hénéris — Schéma Supabase
-- Exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- profiles : lié à auth.users via trigger
create table if not exists public.profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('client', 'shopper', 'admin')) default 'client',
  prenom      text not null default '',
  nom         text not null default '',
  email       text not null default '',
  created_at  timestamptz not null default now(),
  unique(user_id)
);

-- demandes : déposées par les clients
create table if not exists public.demandes (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  categorie   text not null,
  description text not null,
  budget_min  numeric(12,2) not null,
  budget_max  numeric(12,2) not null,
  delai       text,
  statut      text not null check (statut in ('en_attente', 'en_cours', 'livre', 'annule')) default 'en_attente',
  created_at  timestamptz not null default now()
);

-- articles : publiés par les shoppers
create table if not exists public.articles (
  id          uuid primary key default uuid_generate_v4(),
  shopper_id  uuid not null references public.profiles(id) on delete cascade,
  titre       text not null,
  description text not null default '',
  prix        numeric(12,2) not null,
  categorie   text not null,
  statut      text not null check (statut in ('disponible', 'réservé', 'vendu')) default 'disponible',
  created_at  timestamptz not null default now()
);

-- conversations : entre un client et un shopper, liée à une demande
create table if not exists public.conversations (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  shopper_id  uuid not null references public.profiles(id) on delete cascade,
  demande_id  uuid references public.demandes(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique(client_id, shopper_id, demande_id)
);

-- messages : dans une conversation
create table if not exists public.messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  contenu         text not null,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- TRIGGER : créer le profil automatiquement à l'inscription
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, role, prenom, nom, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.demandes      enable row level security;
alter table public.articles      enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- ── Helper : récupérer le rôle du user connecté ──────────────
create or replace function public.get_my_role()
returns text language sql security definer stable as $$
  select role from public.profiles where user_id = auth.uid()
$$;

-- ── profiles ──────────────────────────────────────────────────
-- Lecture : chacun voit son propre profil ; les shoppers sont visibles de tous les clients connectés
create policy "profiles_select_own" on public.profiles
  for select using (user_id = auth.uid());

create policy "profiles_select_shoppers" on public.profiles
  for select using (role = 'shopper' and auth.uid() is not null);

-- Modification : seulement son propre profil
create policy "profiles_update_own" on public.profiles
  for update using (user_id = auth.uid());

-- ── demandes ──────────────────────────────────────────────────
-- Le client voit et modifie ses propres demandes
create policy "demandes_client_select" on public.demandes
  for select using (
    client_id = (select id from public.profiles where user_id = auth.uid())
  );

create policy "demandes_client_insert" on public.demandes
  for insert with check (
    client_id = (select id from public.profiles where user_id = auth.uid())
    and get_my_role() = 'client'
  );

create policy "demandes_client_update" on public.demandes
  for update using (
    client_id = (select id from public.profiles where user_id = auth.uid())
  );

-- Les shoppers voient toutes les demandes en_attente ou en_cours
create policy "demandes_shopper_select" on public.demandes
  for select using (
    get_my_role() = 'shopper'
    and statut in ('en_attente', 'en_cours')
  );

-- Admin voit tout
create policy "demandes_admin_all" on public.demandes
  for all using (get_my_role() = 'admin');

-- ── articles ──────────────────────────────────────────────────
-- Lecture : tous les utilisateurs connectés voient le catalogue
create policy "articles_select_connected" on public.articles
  for select using (auth.uid() is not null);

-- Écriture : seulement le shopper propriétaire
create policy "articles_shopper_insert" on public.articles
  for insert with check (
    shopper_id = (select id from public.profiles where user_id = auth.uid())
    and get_my_role() = 'shopper'
  );

create policy "articles_shopper_update" on public.articles
  for update using (
    shopper_id = (select id from public.profiles where user_id = auth.uid())
  );

create policy "articles_shopper_delete" on public.articles
  for delete using (
    shopper_id = (select id from public.profiles where user_id = auth.uid())
  );

-- Admin voit tout
create policy "articles_admin_all" on public.articles
  for all using (get_my_role() = 'admin');

-- ── conversations ──────────────────────────────────────────────
-- Un utilisateur voit uniquement ses conversations
create policy "conversations_participant_select" on public.conversations
  for select using (
    client_id  = (select id from public.profiles where user_id = auth.uid())
    or shopper_id = (select id from public.profiles where user_id = auth.uid())
  );

create policy "conversations_client_insert" on public.conversations
  for insert with check (
    client_id = (select id from public.profiles where user_id = auth.uid())
    and get_my_role() = 'client'
  );

-- ── messages ──────────────────────────────────────────────────
-- Lecture : participants à la conversation uniquement
create policy "messages_participant_select" on public.messages
  for select using (
    conversation_id in (
      select id from public.conversations
      where client_id  = (select id from public.profiles where user_id = auth.uid())
         or shopper_id = (select id from public.profiles where user_id = auth.uid())
    )
  );

-- Envoi : participant à la conversation
create policy "messages_participant_insert" on public.messages
  for insert with check (
    sender_id = (select id from public.profiles where user_id = auth.uid())
    and conversation_id in (
      select id from public.conversations
      where client_id  = (select id from public.profiles where user_id = auth.uid())
         or shopper_id = (select id from public.profiles where user_id = auth.uid())
    )
  );

-- ============================================================
-- INDEX (performance)
-- ============================================================

create index if not exists idx_profiles_user_id      on public.profiles(user_id);
create index if not exists idx_demandes_client_id     on public.demandes(client_id);
create index if not exists idx_demandes_statut        on public.demandes(statut);
create index if not exists idx_articles_shopper_id    on public.articles(shopper_id);
create index if not exists idx_articles_statut        on public.articles(statut);
create index if not exists idx_conversations_client   on public.conversations(client_id);
create index if not exists idx_conversations_shopper  on public.conversations(shopper_id);
create index if not exists idx_messages_conversation  on public.messages(conversation_id);
create index if not exists idx_messages_created_at    on public.messages(created_at);
